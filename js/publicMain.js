'use strict';

/**
 * FONCTION MAIN
 * Fonction lancer dès que la page HTML est chargée
 */
document.addEventListener('DOMContentLoaded', function() {
  TITLE_SECTION = document.getElementById('works');
  // TITLE_H1 = document.querySelector('#works .title');
  TITLE_CONTAINER = document.querySelector('#works .content');
  DESCRIPTION_SECTION = document.getElementById('description');
  SKILL_CONTAINER = document.querySelector('#description .content');
  SKILL_SECTION = document.getElementById('skill');
  SKILL_CONTAINER = document.querySelector('#skill .content');
  SKILLS_CONTAINER = document.querySelector('#skills .content');
  GALLERY_CONTAINER = document.querySelector('#gallery .content');
  PROJECT_SECTION = document.getElementById('project');
  PROJECT_CONTAINER = document.querySelector('#project .content');

  // NAV
  let checkbox = document.querySelector('input[name=checkbox]');
  let navLinks = document.querySelectorAll('.menuLink');
  navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
      let modalsDisplayed = document.querySelectorAll('.modal.displayed');
      console.log(navLink.id)
      if (modalsDisplayed && navLink.id == 'menuHome') {
        modalsDisplayed.forEach(modal => {
          hideSection(modal);
        });
        removeAllChildren(TITLE_CONTAINER);
      }
      checkbox.checked = false;
    });
  });

  // BACK BUTTONS
  let backButtons = document.querySelectorAll('.back.button');
  backButtons.forEach(backButton => {
    backButton.addEventListener('click', function() {
      hideSection(document.getElementById(this.dataset.idSection));
      if (this.dataset.idSection == 'works') removeAllChildren(TITLE_CONTAINER);
    });
  });

  let homeLinks = document.querySelectorAll('.title');
  homeLinks.forEach(homeLink => {homeLink.addEventListener('click', () => {
                      let classnames = homeLink.className.split(' ');
                      displayTitle(homeLink.dataset.idCategory, classnames[0]);
                      updateGallery(homeLink.dataset.idCategory);
                    })})

  // TITLE OF CATEGORY : cache les sections modales au cas où certaines seraient
  // encore affichées
  let titleLinks = document.querySelectorAll('.title');
  titleLinks.forEach(titleLink => {
    titleLink.addEventListener('click', () => {
      console.log(titleLink.className)
      let modalsDisplayed = document.querySelectorAll('.modal.displayed');

      if (modalsDisplayed) {
        modalsDisplayed.forEach(modal => {
          hideSection(modal);
        });
      }
    });
  });

  /*###################################################*/
  /*################## SKILLS SECTION #################*/
  /*###################################################*/
  getAllSkillsByCategory()
      .then(skillsByCategories => generateSkillsAsList(skillsByCategories))
      .then(skillList => {
        SKILLS_CONTAINER.append(skillList);
      });

  /*###################################################*/
  /*################# GALLERY SECTION #################*/
  /*###################################################*/
  getAllProjectsCategories()
      .then(projectCategories => generateGalleryFilters(projectCategories))
      .then(galleryFilters => {
        GALLERY_CONTAINER.append(galleryFilters);

        let filters = document.querySelectorAll('.filter');
        filters.forEach(filter => {
          filter.addEventListener('click', updateGallery);
        });
        document.querySelector('#gallery .filter:last-child')
            .classList.add('selected');

        getAllProjects().then(projects => {
          displayGallery(projects);
        });
      });
});

/*###################################################*/
/*################ GALLERY SECTIONS #################*/
/*###################################################*/

/*----------------- GALLERY SECTION ----------------*/
function displayGallery(projects) {
  TITLE_CONTAINER.append(generateGallery(projects));
}

function generateGallery(projects) {
  let divGallery = document.createElement('div');
  divGallery.id = 'projectList';
  let titleWorks = document.createElement('h2');
  titleWorks.classList.add('workTitle');
  titleWorks.innerHTML = 'WORKS WORKS';
  divGallery.append(titleWorks);
  for (let current in projects) {
    let project = projects[current];

    let divProject = document.createElement('div');
    divProject.classList.add('project');
    divProject.dataset.idProject = project['idProjet'];
    divProject.addEventListener('click', displayProject);

    let divDeco1 = document.createElement('div');
    let divDeco2 = document.createElement('div');
    divDeco1.classList.add('deco1');
    divDeco2.classList.add('deco2');

    let miniature = document.createElement('img');
    miniature.src = project['miniature'];
    miniature.alt = 'Miniature du projet ' + project['titre'];
    miniature.classList.add('miniature');
    divProject.append(miniature);
    divProject.append(divDeco1);
    divProject.append(divDeco2);

    let projectTitle = document.createElement('span');
    projectTitle.classList.add('projectTitle');
    projectTitle.innerHTML = project['titre'];

    divProject.append(projectTitle);
    divGallery.append(divProject);
  }

  return divGallery;
}

function updateGallery(idCategory) {
  console.log(idCategory);
  getAllProjectsFromACategory(idCategory).then(projects => {
    displayGallery(projects);
  });
}
