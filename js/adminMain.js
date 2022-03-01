'use strict';

/**
 * MAIN
 * Fonction lancer dès que la page HTML est chargées
 */
document.addEventListener('DOMContentLoaded', function() {
  SKILLS_CONTAINER = document.querySelector('#skills .content');
  SKILL_SECTION = document.getElementById('skill');
  SKILL_CONTAINER = document.querySelector('#skill .content');
  SKILL_FORM_SECTION = document.getElementById('skillForm');
  GALLERY_CONTAINER = document.querySelector('#gallery .content');
  PROJECT_SECTION = document.getElementById('project');
  PROJECT_CONTAINER = document.querySelector('#project .content');
  PROJECT_FORM_SECTION = document.getElementById('projectForm');
  MEDIA_SECTION = document.getElementById('projectMedia');
  MEDIA_CONTAINER = document.querySelector('#projectMedia .content');
  MEDIA_FORM_SECTION = document.getElementById('mediaForm');

  // NAV
  let navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
      let modalDisplayed = document.querySelector('.modal.displayed');

      if (modalDisplayed) {
        hideSection(modalDisplayed);
      }
    });
  });

  // BACK BUTTONS
  let backButtons = document.querySelectorAll('.back.button');
  backButtons.forEach(backButton => {
    backButton.addEventListener('click', function() {
      hideSection(document.getElementById(this.dataset.idSection));
    });
  });

  // FORMS
  getAllCategories().then(categories => {
    addCategoriesToForms(categories);
  });

  // SUPPRESSION DU REFRESH ON SUBMIT DE TOUS LES FORMS
  let forms = document.querySelectorAll('form');
  forms.forEach(form => {form.addEventListener('submit', (evt) => {
                  evt.preventDefault();
                })});

  // CATEGORY FORM
  let categoryForm = document.querySelector('.categoryForm');

  categoryForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addCategoryAndRefresh().then(categories => {
      categoryForm.reset();
      addCategoriesToForms(categories);
    });
  });

  let categoryButton = document.querySelector('#categoryForm .button.display');
  categoryButton.addEventListener('click', () => {
    categoryForm.classList.toggle('displayed');
    if (document.querySelector('#categoryForm').offsetWidth == 80) {
      document.querySelector('#categoryForm').style.width = '300px';
      document.querySelector('#categoryForm').style.height = 'min-content';
    } else {
      setTimeout(() => {
        document.querySelector('#categoryForm').style.width = '50px';
        document.querySelector('#categoryForm').style.height = '105px';
      }, 500);
    }
  });

  // SKILL FORM
  let iconeInput = document.querySelector('.skillForm input.icone');
  iconeInput.addEventListener('change', function() {
    imageUploaded('skillForm', this);
  });

  // PROJECT FORM
  let addCategoryButton = document.querySelector('.categories .button.add');
  addCategoryButton.addEventListener('click', addCategoryToProject);

  let miniatureInput = document.querySelector('.projectForm input.miniature');
  miniatureInput.addEventListener('change', function() {
    imageUploaded('projectForm', this);
  });

  /*###################################################*/
  /*################## SKILLS SECTION #################*/
  /*###################################################*/
  getAllSkillsByCategory().then(skillsByCategories => {
    let addSkillButton = document.querySelector('#skills .add.button');
    addSkillButton.addEventListener(
        'click', console.log('add skills'));  // displaySkillForm);
    displaySkillsDashboard(skillsByCategories);
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
          filter.addEventListener('click', updateGalleryDashboard);
        });
        document.querySelector('#gallery .filter:last-child')
            .classList.add('selected');

        getAllProjects().then(projects => {
          let addProjectButton = document.querySelector('#gallery .add.button');
          addProjectButton.addEventListener('click', displayProjectForm);
          displayGalleryDashboard(projects);
        });
      });

  // ADD MEDIUM BUTTON
  let addMediaButton = document.querySelector('#projectMedia .add.button');
  addMediaButton.addEventListener('click', displayMediaForm);


  /*###################################################*/
  /*################## MEDIA SECTION ##################*/
  /*###################################################*/

  let mediaInput = document.querySelector('.mediaForm input.media');
  mediaInput.addEventListener('change', function() {
    imageUploaded('mediaForm', this);
  });
});

/*###################################################*/
/*################## SKILL SECTIONS #################*/
/*###################################################*/

/*---------------- SKILLS DASHBOARD -----------------*/
function displaySkillsDashboard(skillsByCategories) {
  // SUPPRESSION DES ÉLÉMENTS PRÉCÉDENTS
  removeAllChildren(SKILLS_CONTAINER);

  SKILLS_CONTAINER.append(generateSkillsAsList(skillsByCategories));

  let skills = document.querySelectorAll('li.skill');

  skills.forEach(skill => {
    skill.append(generateModifySkillButton(skill.dataset.idSkill));
    skill.append(generateDeleteSkillButton(skill.dataset.idSkill));
  });
}

/*-------------------- SKILL FORM -------------------*/
function displaySkillForm() {
  // RÉINITIALISATION DU FORM
  let skillForm = document.querySelector('form.skillForm');
  skillForm.reset();
  skillForm.removeEventListener('submit', modifySkillFormSubmitted);
  skillForm.removeEventListener('submit', addSkillFormSubmitted);
  skillForm.addEventListener('submit', addSkillFormSubmitted);

  let iconePreview = document.querySelector('.skillForm .preview');
  removeAllChildren(iconePreview);
  let defaultIconeText = document.createElement('span');
  defaultIconeText.textContent = 'Aucun fichier sélectionné';
  iconePreview.append(defaultIconeText);

  displaySection(SKILL_FORM_SECTION);
  document.querySelector('#categoryForm').classList.add('displayed');
}

function addSkillFormSubmitted(evt) {
  evt.preventDefault();
  document.querySelector('form.skillForm .submit.button').disabled = true;
  addSkillAndRefresh().then(skills => {
    displaySkillsDashboard(skills);
    hideSection(SKILL_FORM_SECTION);
    document.querySelector('form.skillForm .submit.button').disabled = false;
  });
}

function displayFilledSkillForm(idSkill) {
  // RÉINITIALISATION DU FORM
  let skillForm = document.querySelector('form.skillForm');
  skillForm.dataset.idSkill = idSkill;
  skillForm.reset();
  skillForm.removeEventListener('submit', modifySkillFormSubmitted);
  skillForm.removeEventListener('submit', addSkillFormSubmitted);
  skillForm.addEventListener('submit', modifySkillFormSubmitted);

  getSkill(idSkill).then(skillDetails => {
    document.querySelector('.skillForm .name').value = skillDetails['nom'];

    // PRÉVISUALISATION DE L'ICONE DE LA COMPÉTENCE
    let divPreview = document.querySelector('.skillForm .preview');
    removeAllChildren(divPreview);
    let icone = document.createElement('img');
    icone.src = skillDetails['icone'];
    icone.alt = 'Prévisualisation de l\'icone de la compétence ' +
        skillDetails['nom'] + '.';
    divPreview.append(icone);

    // AFFICHAGE DE LA CATÉGORIE DU PROJET
    let categorySelector =
        document.querySelector('.skillForm .categorySelector');
    let count = 0;
    let optionSelected = false;
    while (!optionSelected) {
      if (categorySelector.options[count].value ==
          skillDetails['idCategorie']) {
        categorySelector.options[count].selected = true;
        optionSelected = true;
      }
      count++;
    }

    document.querySelector('.skillForm .description').value =
        skillDetails['description'];

    displaySection(SKILL_FORM_SECTION);
    document.querySelector('#categoryForm').classList.add('displayed');
  });
}

function modifySkillFormSubmitted() {
  document.querySelector('form.skillForm .submit.button').disabled = true;
  updateSkillAndRefresh(this.dataset.idSkill).then(skills => {
    displaySkillsDashboard(skills);
    hideSection(SKILL_FORM_SECTION);
    document.querySelector('form.skillForm .submit.button').disabled = false;
  });
}

/*###################################################*/
/*################# GALLERY SECTIONS ################*/
/*###################################################*/

/*---------------- GALLERY DASHBOARD ----------------*/
function displayGalleryDashboard(projects) {
  let projectList = document.getElementById('projectList');
  if (projectList) {
    projectList.remove();
  }

  GALLERY_CONTAINER.append(generateGalleryDashboard(projects));
}

function updateGalleryDashboard() {
  if (!this.classList.contains('selected')) {
    document.querySelector('#gallery .filter.selected')
        .classList.remove('selected');
    this.classList.add('selected');

    if (this.dataset.idCategory == 'all') {
      getAllProjects().then(projects => {
        displayGalleryDashboard(projects);
      });
    } else {
      getAllProjectsFromACategory(this.dataset.idCategory).then(projects => {
        displayGalleryDashboard(projects);
      });
    }
  }
}

function generateGalleryDashboard(projects) {
  let projectList = document.createElement('ul');
  projectList.id = 'projectList';

  for (let current in projects) {
    let project = projects[current];

    let liProject = document.createElement('li');
    liProject.classList.add('project');
    liProject.dataset.idProject = project['idProjet'];

    let idProject = document.createElement('span');
    idProject.classList.add('idProject');
    idProject.innerHTML = project['idProjet'];
    liProject.append(idProject);

    let projectTitle = document.createElement('span');
    projectTitle.classList.add('projectTitle');
    projectTitle.dataset.idProject = project['idProjet'];
    projectTitle.innerHTML = project['titre'];
    projectTitle.addEventListener('click', displayProject);
    liProject.append(projectTitle);

    liProject.append(generateMediaButton(project['idProjet']));

    liProject.append(generateModifyProjectButton(project['idProjet']));

    liProject.append(generateDeleteProjectButton(project['idProjet']));

    projectList.append(liProject);
  }

  return projectList;
}

/*------------------ PROJECT FORM ------------------*/
function displayProjectForm() {
  let categoriesList = document.querySelector('.categoriesList');
  removeAllChildren(categoriesList);

  let divPreview = document.querySelector('.projectForm .preview');
  removeAllChildren(divPreview);

  getAllCategories().then(categories => {
    // RÉINITIALISATION DU FORM
    let projectForm = document.querySelector('form.projectForm');
    projectForm.reset();
    projectForm.removeEventListener('submit', modifyProjectFormSubmitted);
    projectForm.removeEventListener('submit', addProjectFormSubmitted);
    projectForm.addEventListener('submit', addProjectFormSubmitted);

    // AJOUT DES DIFFÉRENTES CATÉGORIES DISPONIBLES AU FORM
    addCategoriesToAForm(categories, 'projectForm');

    displaySection(PROJECT_FORM_SECTION);
    document.querySelector('#categoryForm').classList.add('displayed');
  });
}

function addCategoryToProject() {
  let categorieList = document.querySelector('.categoriesList');
  let categorySelector =
      document.querySelector('#projectForm .categorySelector');
  let categorySelected =
      categorySelector.options[categorySelector.selectedIndex];

  let category = document.createElement('span');
  category.classList.add('category');
  category.dataset.idCategory = categorySelected.value;
  category.innerHTML = categorySelected.innerHTML;
  categorySelected.remove();

  let cross = document.createElement('img');
  cross.src = './css/img/cross.png';
  cross.alt = 'Icone de croix';
  cross.addEventListener('click', () => {
    categorySelector.append(categorySelected);
    category.remove();
  });
  category.append(cross);

  categorieList.append(category);
}

function addProjectFormSubmitted(evt) {
  evt.preventDefault();
  document.querySelector('form.projectForm .submit.button').disabled = true;
  addProjectAndRefresh().then(projects => {
    document.querySelector('form.projectForm .submit.button').disabled = false;
    displayGalleryDashboard(projects);
    hideSection(PROJECT_FORM_SECTION);
  });
}

function displayFilledProjectForm(idProject) {
  getAllCategories().then(categories => {
    // RÉINITIALISATION DU FORM
    let projectForm = document.querySelector('form.projectForm');
    projectForm.dataset.idProject = idProject;
    projectForm.reset();
    projectForm.removeEventListener('submit', modifyProjectFormSubmitted);
    projectForm.removeEventListener('submit', addProjectFormSubmitted);
    projectForm.addEventListener('submit', modifyProjectFormSubmitted);

    let categoriesList = document.querySelector('.categoriesList');
    removeAllChildren(categoriesList);

    let divPreview = document.querySelector('.projectForm .preview');
    removeAllChildren(divPreview);

    // AJOUT DES DIFFÉRENTES CATÉGORIES DISPONIBLES AU FORM
    addCategoriesToAForm(categories, 'projectForm');

    // AFFICHAGE DES DIFFÉRENTES CATÉGORIES DU PROJET
    getAllCategoriesOfAProject(idProject).then(categories => {
      let categorySelector =
          document.querySelector('.projectForm .categorySelector');
      let addCategoryButton = document.querySelector('.categories .button.add');

      for (let index in categories) {
        let category = categories[index];

        let count = 0;
        let categoryFound = false;
        while (!categoryFound) {
          if (categorySelector.options[count].value ==
              category['idCategorie']) {
            categorySelector.options[count].selected = true;
            categoryFound = true;
          }
          count++;
        }

        addCategoryButton.click();
      }
    });

    getProject(idProject).then(projectDetails => {
      let projectInfos = projectDetails['infos'];

      document.querySelector('.projectForm .title').value =
          projectInfos['titre'];

      // PRÉVISUALISATION DE L'ICONE DE LA COMPÉTENCE
      let miniature = document.createElement('img');
      miniature.src = projectInfos['miniature'];
      miniature.alt = 'Prévisualisation de l\'icone de la compétence ' +
          projectInfos['titre'] + '.';
      divPreview.append(miniature);

      document.querySelector('.projectForm .date').value = projectInfos['date'];

      document.querySelector('.projectForm .technique').value =
          projectInfos['technique'];

      document.querySelector('.projectForm .description').value =
          projectInfos['description'];

      displaySection(PROJECT_FORM_SECTION);
      document.querySelector('#categoryForm').classList.add('displayed');
    });
  });
}

function modifyProjectFormSubmitted() {
  document.querySelector('form.projectForm .submit.button').disabled = true;
  updateProjectAndRefresh(this.dataset.idProject).then(projects => {
    document.querySelector('form.projectForm .submit.button').disabled = false;
    displayGalleryDashboard(projects);
    hideSection(PROJECT_FORM_SECTION);
  });
}

/*------------------ MEDIA ------------------*/
function displayProjectMediaDashboard(projectDetails) {
  let mediaList = document.getElementById('mediaList');
  if (mediaList) {
    mediaList.remove();
  }

  MEDIA_CONTAINER.append(generateProjectMediaDashboard(projectDetails));

  let addMediumButton = document.querySelector('#projectMedia .add.button');
  addMediumButton.dataset.idProject = projectDetails['infos']['idProjet'];

  displaySection(MEDIA_SECTION);
}

function generateProjectMediaDashboard(projectDetails) {
  let sectionTitle = document.querySelector('#projectMedia h2');
  sectionTitle.innerHTML =
      'Média du projet ' + projectDetails['infos']['titre'];

  let mediaList = document.createElement('ul');
  mediaList.id = 'mediaList';

  for (let current in projectDetails['media']) {
    let media = projectDetails['media'][current];

    let liMedia = document.createElement('li');
    liMedia.classList.add('media');
    liMedia.dataset.idMedia = media['idMedia'];

    let idMedia = document.createElement('span');
    idMedia.classList.add('idMedia');
    idMedia.innerHTML = media['idMedia'];
    liMedia.append(idMedia);

    let mediaPreview = document.createElement('span');
    mediaPreview.classList.add('mediaPreview');
    let img = document.createElement('img');
    switch (media['type']) {
      case 'photo':
        img.src = media['source'];
        img.alt = media['legende'];
        break;
      case 'video':
        img.src = projectDetails['infos']['miniature'];
        img.alt = 'Miniature de la vidéo du projet ' +
            projectDetails['infos']['titre'];
        break;
      default:
        img.src = 'néan';
        img.alt = 'aucune image pour ce projet';
        break;
    }
    mediaPreview.append(img);
    liMedia.append(mediaPreview);

    liMedia.append(generateModifyMediaButton(media['idMedia']));

    liMedia.append(generateDeleteMediaButton(media['idMedia']));

    mediaList.append(liMedia);
  }

  return mediaList;
}

function displayMediaForm() {
  // RÉINITIALISATION DU FORM
  let mediaForm = document.querySelector('form.mediaForm');
  mediaForm.dataset.idProject = this.dataset.idProject;
  mediaForm.reset();
  mediaForm.removeEventListener('submit', modifyMediumFormSubmitted);
  mediaForm.removeEventListener('submit', addMediaFormSubmitted);
  mediaForm.addEventListener('submit', addMediaFormSubmitted);

  let iconePreview = document.querySelector('.mediaForm .preview');
  removeAllChildren(iconePreview);

  displaySection(MEDIA_FORM_SECTION);
}

function displayFilledMediaForm(idMedium) {
  // RÉINITIALISATION DU FORM
  let mediaForm = document.querySelector('form.mediaForm');
  mediaForm.dataset.idMedium = idMedium;
  mediaForm.reset();
  mediaForm.removeEventListener('submit', modifyMediumFormSubmitted);
  mediaForm.removeEventListener('submit', addMediaFormSubmitted);
  mediaForm.addEventListener('submit', modifyMediumFormSubmitted);

  getMedium(idMedium).then(mediumDetails => {
    console.log(mediumDetails[0]['legende']);
    let medium = mediumDetails[0];

    // PRÉVISUALISATION DE L'IMAGE
    let divPreview = document.querySelector('.mediaForm .preview');
    removeAllChildren(divPreview);
    let image = document.createElement('img');
    image.src = mediumDetails[0]['source'];
    image.alt = mediumDetails[0]['legend'];
    divPreview.append(image);

    document.querySelector('.mediaForm .legende').value = medium['legende'];

    displaySection(MEDIA_FORM_SECTION);
    document.querySelector('#mediaForm').classList.add('displayed');
  });
}

function addMediaFormSubmitted() {
  document.querySelector('form.mediaForm .submit.button').disabled = true;
  addMediumAndRefresh(this.dataset.idProject).then(projects => {
    document.querySelector('form.mediaForm .submit.button').disabled = false;
    displayProjectMediaDashboard(projects);
    hideSection(MEDIA_FORM_SECTION);
  });
}

function modifyMediumFormSubmitted() {
  document.querySelector('form.mediaForm .submit.button').disabled = true;
  updateMediumAndRefresh(this.dataset.idMedium).then(projects => {
    document.querySelector('form.mediaForm .submit.button').disabled = false;
    displayProjectMediaDashboard(projects);
    hideSection(MEDIA_FORM_SECTION);
  });
}



/*###################################################*/
/*##################### GENERAL #####################*/
/*###################################################*/

function generateMediaButton(idProject) {
  let MediaButton = document.createElement('span');
  MediaButton.classList.add('button');
  MediaButton.classList.add('manage');
  MediaButton.dataset.idProject = idProject;
  MediaButton.innerHTML = 'Gérer les média';
  MediaButton.addEventListener('click', function() {
    getProject(this.dataset.idProject).then(projectDetails => {
      displayProjectMediaDashboard(projectDetails);
    });
  });

  return MediaButton;
}

function generateModifySkillButton(idSkill) {
  let modifyButton = document.createElement('span');
  modifyButton.classList.add('button');
  modifyButton.classList.add('modify');
  modifyButton.dataset.idSkill = idSkill;
  modifyButton.innerHTML = 'Modifier';
  modifyButton.addEventListener('click', function() {
    displayFilledSkillForm(this.dataset.idSkill);
  });

  return modifyButton;
}

function generateDeleteSkillButton(idSkill) {
  let deleteButton = document.createElement('span');
  deleteButton.classList.add('button');
  deleteButton.classList.add('delete');
  deleteButton.dataset.idSkill = idSkill;
  deleteButton.innerHTML = 'Supprimer';
  deleteButton.addEventListener('click', function() {
    deleteSkillandRefresh(this.dataset.idSkill).then(skillsByCategories => {
      displaySkillsDashboard(skillsByCategories);
    });
  });

  return deleteButton;
}

function generateModifyProjectButton(idProject) {
  let modifyButton = document.createElement('span');
  modifyButton.classList.add('button');
  modifyButton.classList.add('modify');
  modifyButton.dataset.idProject = idProject;
  modifyButton.innerHTML = 'Modifier';
  modifyButton.addEventListener('click', function() {
    displayFilledProjectForm(this.dataset.idProject);
  });

  return modifyButton;
}

function generateDeleteProjectButton(idProject) {
  let deleteButton = document.createElement('span');
  deleteButton.classList.add('button');
  deleteButton.classList.add('delete');
  deleteButton.dataset.idProject = idProject;
  deleteButton.innerHTML = 'Supprimer';
  deleteButton.addEventListener('click', function() {
    deleteProjectAndRefresh(this.dataset.idProject).then(projects => {
      displayGalleryDashboard(projects);
    });
  });

  return deleteButton;
}

function generateModifyMediaButton(idMedia) {
  let modifyButton = document.createElement('span');
  modifyButton.classList.add('button');
  modifyButton.classList.add('modify');
  modifyButton.dataset.idMedia = idMedia;
  modifyButton.innerHTML = 'Modifier';
  modifyButton.addEventListener('click', function() {
    displayFilledMediaForm(this.dataset.idMedia);
  });

  return modifyButton;
}

function generateDeleteMediaButton(idMedia) {
  let deleteButton = document.createElement('span');
  deleteButton.classList.add('button');
  deleteButton.classList.add('delete');
  deleteButton.dataset.idMedia = idMedia;
  deleteButton.innerHTML = 'Supprimer';
  deleteButton.addEventListener('click', function() {
    deleteMediaAndRefresh(this.dataset.idMedia).then(projectDetails => {
      displayProjectMediaDashboard(projectDetails);
    });
  });

  return deleteButton;
}

function imageUploaded(currentForm, input) {
  let divPreview = document.querySelector('.' + currentForm + ' .preview');
  removeAllChildren(divPreview);

  let img = input.files[0];

  let fileReader = new FileReader();
  fileReader.readAsDataURL(img);

  fileReader.onload = () => {
    let fileURL = fileReader.result;

    let img = document.createElement('img');
    img.src = fileURL;
    img.alt = 'Prévisualisation de l\'icone de compétence.';
    divPreview.append(img);
  }
}

function addCategoriesToForms(categories) {
  let categorySelectors = document.querySelectorAll('select.categorySelector');

  categorySelectors.forEach(categorySelector => {
    removeAllChildren(categorySelector);
    for (let current in categories) {
      let category = categories[current];
      let option = document.createElement('option');
      option.classList.add(category['idCategorie']);
      option.value = category['idCategorie'];
      option.innerHTML = category['nom'];
      categorySelector.append(option);
    }
  });

  let projectCategories =
      document.querySelectorAll('.categoriesList .category');

  if (projectCategories) {
    let projectCategorySelector =
        document.querySelector('.categories .categorySelector');

    projectCategories.forEach(category => {
      let remove = false;
      let count = 0;

      while (!remove) {
        if (projectCategorySelector.options[count].value ==
            category.dataset.idCategory) {
          projectCategorySelector.options[count].remove();
          remove = true;
        }
        count++;
      }
    });
  }
}

function addCategoriesToAForm(categories, idForm) {
  let categorySelector =
      document.querySelector('#' + idForm + ' .categorySelector');

  removeAllChildren(categorySelector);
  for (let current in categories) {
    let category = categories[current];
    let option = document.createElement('option');
    option.classList.add(category['idCategorie']);
    option.value = category['idCategorie'];
    option.innerHTML = category['nom'];
    categorySelector.append(option);
  }
}