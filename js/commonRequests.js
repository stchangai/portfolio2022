'use strict';

/*###################################################*/
/*##################### REQUESTS ####################*/
/*###################################################*/

// EXAMPLE :
// async function getPlanetDetails(planetId){
//     const response = await fetch('./SERVER/router.php/planet/'+planetId);
//     const planets = await response.json();

//     console.log(planets);
//     return planets;
// }

/*###################################################*/
/*################## CATEGORY SECTIONS #################*/
/*###################################################*/

async function getCategory(idCategory) {
  const response =
      await fetch('php/categoriesRouter.php/category/' + idCategory);
  const category = await response.json();

  console.log(category);
  return category;
}

/*###################################################*/
/*################## SKILL SECTIONS #################*/
/*###################################################*/

/*--------------------- SKILLS ---------------------*/
async function getAllSkillsByCategory() {
  const response = await fetch('php/skillsRouter.php/skills/');
  const skills = await response.json();

  // console.log(skills);
  return skills;
}

/*---------------------- SKILL ---------------------*/
async function getSkill(idSkill) {
  const response = await fetch('php/skillsRouter.php/skill/' + idSkill);
  const skills = await response.json();

  // console.log(skills);
  return skills;
}

/*###################################################*/
/*################# GALLERY SECTIONS ################*/
/*###################################################*/

/*----------------- GALLERY SECTION ----------------*/
async function getAllProjects() {
  const response = await fetch('php/galleryRouter.php/projects/');
  const projects = await response.json();

  // console.log(projects);
  return projects;
}

async function getAllProjectsFromACategory(idCategory) {
  const response = await fetch('php/galleryRouter.php/category/' + idCategory);
  const projects = await response.json();

  // console.log(projects);
  return projects;
}

/*----------------- PROJECT SECTION ----------------*/
async function getProject(idProject) {
  const response = await fetch('php/galleryRouter.php/project/' + idProject);
  const projet = await response.json();

  // console.log(projet);
  return projet;
}

async function getAllProjectsCategories() {
  const response = await fetch('php/galleryRouter.php/categories/');
  const categories = await response.json();

  // console.log(categories);
  return categories;
}

/*----------------- MEDIA SECTION ----------------*/

async function getMedium(idMedium) {
  const response = await fetch('php/mediaRouter.php/medium/' + idMedium);
  const media = await response.json();

  // console.log(media);
  return media;
}