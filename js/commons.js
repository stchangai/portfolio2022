'use strict'

// COMMON CONSTANTS
var TITLE_SECTION;
// var TITLE_H1;
var TITLE_CONTAINER;
var DESCRIPTION_SECTION;
var DESCRIPTION_CONTAINER;
var SKILLS_CONTAINER;
var SKILL_SECTION;
var SKILL_CONTAINER;
var SKILL_FORM_SECTION;
var GALLERY_CONTAINER;
var PROJECT_SECTION;
var PROJECT_CONTAINER;
var PROJECT_FORM_SECTION;
var MEDIA_SECTION;
var MEDIA_CONTAINER;
var MEDIA_FORM_SECTION;

/*###################################################*/
/*################## HOME PAGE #################*/
/*###################################################*/

/*--------------------- MENU BURGER ---------------------*/
let menuContent = document.getElementsByClassName('menuLink')

let checkbox = document.querySelector('input[name=checkbox]');
if (!checkbox.checked) {
  for (let element = 0; element < menuContent.length; element++) {
    menuContent[element].style.visibility = 'hidden';
  }
}

checkbox.addEventListener('change', function() {
  if (this.checked) {
    console.log('Checkbox is checked..');
    for (let element = 0; element < menuContent.length; element++) {
      menuContent[element].style.visibility = 'visible';
    }
  } else {
    console.log('Checkbox is not checked..');
    for (let element = 0; element < menuContent.length; element++) {
      menuContent[element].style.visibility = 'hidden';
    }
  }
});
/*###################################################*/
/*################## TITLE SECTIONS #################*/
/*###################################################*/

function displayTitle(idCategory, classname) {
  getCategory(idCategory).then(categoryDetails => {
    // SUPPRESSION DES ÉLÉMENTS PRÉEXISTANTS
    removeAllChildren(TITLE_CONTAINER);

    // CRÉATION ET AJOUT DES NOUVEAUX ÉLÉMENTS
    let titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.classList.add(classname);
    let categoryTitle = document.createElement('h1');
    categoryTitle.classList.add('categoryTitle');
    categoryTitle.innerHTML = categoryDetails['nom'];
    titleDiv.append(categoryTitle);
    TITLE_CONTAINER.append(titleDiv);

    let description = document.createElement('p');
    description.classList.add('description');
    description.innerHTML = categoryDetails['description'];
    TITLE_CONTAINER.append(description);

    console.log(categoryDetails);
    // AFFICHAGE
    displaySection(TITLE_SECTION);
  })
};

/*###################################################*/
/*################## SKILL SECTIONS #################*/
/*###################################################*/

/*--------------------- SKILLS ---------------------*/
function generateSkillsAsList(skillsByCategories) {
  // On créer la liste principale
  let ulCategories = document.createElement('ul');
  ulCategories.classList.add('skillCategoryList');

  // On créer les sous listes
  for (let category in skillsByCategories) {
    let tabCategory = skillsByCategories[category];
    let liCategory = document.createElement('li');
    liCategory.classList.add('skillCategory');
    liCategory.dataset.idCategory = tabCategory['idCategory'];
    let categroyName = document.createElement('span');
    categroyName.classList.add('categoryName');
    categroyName.innerHTML = category;
    liCategory.append(categroyName);

    let ulSkills = document.createElement('ul');
    ulSkills.classList.add('skillList');
    for (let skill in tabCategory['skills']) {
      let tabSkill = tabCategory['skills'][skill];
      let liSkill = document.createElement('li');
      liSkill.classList.add('skill');
      liSkill.dataset.idSkill = tabSkill['idComp'];
      let skillName = document.createElement('span');
      skillName.classList.add('skillName');
      skillName.dataset.idSkill = tabSkill['idComp'];
      skillName.addEventListener('click', displaySkill);
      skillName.innerHTML = tabSkill['outil'];
      liSkill.append(skillName);
      ulSkills.append(liSkill);
    }
    liCategory.append(ulSkills);
    ulCategories.append(liCategory);
  }

  return ulCategories;
}

function displaySkill() {
  getSkill(this.dataset.idSkill).then(skillDetails => {
    // SUPPRESSION DES ÉLÉMENTS PRÉEXISTANTS
    removeAllChildren(SKILL_CONTAINER);

    // CRÉATION ET AJOUT DES NOUVEAUX ÉLÉMENTS
    let skillTitle = document.createElement('h3');
    skillTitle.classList.add('skillTitle');
    skillTitle.innerHTML = skillDetails['nom'];
    SKILL_CONTAINER.append(skillTitle);

    let skillDescription = document.createElement('p');
    skillDescription.classList.add('skillDescription');
    skillDescription.innerHTML = skillDetails['description'];
    SKILL_CONTAINER.append(skillDescription);

    let skillIcone = document.createElement('img');
    skillIcone.src = skillDetails['icone'];
    skillIcone.alt = 'Logo ' + skillDetails['nom'];
    SKILL_CONTAINER.append(skillIcone);

    // AFFICHAGE
    displaySection(SKILL_SECTION);
  });
}

/*###################################################*/
/*################# GALLERY SECTIONS ################*/
/*###################################################*/

/*--------------------- GALLERY ---------------------*/
function generateGalleryFilters(categories) {
  let filterBar = document.createElement('div');
  filterBar.classList.add('filterBar');

  for (let current in categories) {
    let categorie = categories[current];
    let filter = document.createElement('span');
    filter.classList.add('filter');
    filter.dataset.idCategory = categorie['idCategorie'];
    filter.innerHTML = categorie['nom'];

    filterBar.append(filter);
  }

  let filterAll = document.createElement('span');
  filterAll.classList.add('filter');
  filterAll.dataset.idCategory = 'all';
  filterAll.innerHTML = 'All';

  filterBar.append(filterAll);

  return filterBar;
}

function displayProject() {
  getProject(this.dataset.idProject).then(projectDetails => {
    // SUPPRESSION DES ANCIENS CONTENUS
    removeAllChildren(PROJECT_CONTAINER);

    // MEDIA
    let projectMedia = projectDetails['media'];

    let divMedia = document.createElement('div');
    divMedia.classList.add('media');

    for (let index in projectMedia) {
      let projectMedium = projectMedia[index];
      switch (projectMedium['type']) {
        case 'photo':
          let picture = document.createElement('img');
          picture.src = projectMedium['source'];
          picture.alt = projectMedium['legende'];
          picture.classList.add('projectPicture');
          divMedia.append(picture);
          break;
        case 'video':
          let video = document.createElement('iframe');
          video.src = projectMedium['source'];
          divMedia.append(video);
          break;
        default:
          console.log(
              'Le type de media ' + projectMedia['type'] + 'n\'est pas géré');
          break;
      }
    }



    // TEXTUAL INFORMATIONS
    let projectInfos = projectDetails['infos'];

    let divText = document.createElement('div');
    divText.classList.add('infos');

    let title = document.createElement('h3');
    title.classList.add('workTitle');
    title.innerHTML = projectInfos['titre'];
    divText.append(title);

    let date = document.createElement('span');
    date.classList.add('date');
    date.innerHTML = projectInfos['date'];
    divText.append(date);

    let technique = document.createElement('span');
    technique.classList.add('description');
    technique.innerHTML = projectInfos['technique'];
    divText.append(technique);

    let description = document.createElement('p');
    description.classList.add('description');
    description.innerHTML = projectInfos['description'];
    divText.append(description);

    PROJECT_CONTAINER.append(divText);
    PROJECT_CONTAINER.append(divMedia);

    // AFFICHAGE
    displaySection(PROJECT_SECTION);
  });
}

/*###################################################*/
/*##################### GENERAL #####################*/
/*###################################################*/
function removeAllChildren(parent) {
  while (parent.firstElementChild) {
    parent.removeChild(parent.firstElementChild);
  }
}

function displaySection(section) {
  let body = document.querySelector('body');

  section.classList.add('displayed');
  if (section.id == 'project') body.classList.add('locked');
}

function hideSection(section) {
  let body = document.querySelector('body');

  section.classList.remove('displayed');
  body.classList.remove('locked');

  let categoryForm = document.querySelector('#categoryForm.displayed');

  if (categoryForm) {
    categoryForm.classList.remove('displayed');
  }
}