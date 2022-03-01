<?php
// IMPORTATION DES MODELS
require_once('galleryModels.php');
require_once('mediaModels.php');

// CONTROLEURS

function getAllProjectsFromACategoryAsJSON($idCategory){
    return json_encode(getAllProjectsFromACategory($idCategory));
}

function getAllProjectsAsJSON() {
    return json_encode(getAllProjects());
}

function getAllProjectsCategoriesAsJSON() {
    return json_encode(getAllProjectsCategories());
}

function getProjectAsJSON($idProject) {
    $project = array(
        "infos" => getProjectInfos($idProject),
        "media" => getProjectMedia($idProject),
    );
        
    return json_encode($project);
}

function getAllCategoriesOfAProjectAsJSON($idProject) {
    return json_encode(getAllCategoriesOfProject($idProject));
}

function deleteProjectAndRefresh($idProject){
    // Suppression des médias stockés
    $projectMedia = getProjectMedia($idProject);

    foreach($projectMedia as $medium){
        unlink('.'.$medium['source']);
    }

    rmdir("../img/gallery/".$idProject);

    // Suppression du projet en base de donné
    deleteProject($idProject);

    return json_encode(getAllProjects());
}


function addProjectAndRefresh(){
    $projet=$_POST;
    $files=$_FILES;
    $categories = json_decode($projet['categorie']);
    move_uploaded_file($files['miniature']['tmp_name'], '../img/gallery/miniatures/'.basename($files['miniature']['name']));
    $cheminfichier='./img/gallery/miniatures/'.basename($files['miniature']['name']);
    addProject($projet['titre'], $projet['date'], $projet['technique'], $projet['description'], $cheminfichier, $projet['ordre']);
    foreach($categories as $value){
        linkProjectToCategory($projet['titre'], $value);
    }
    return json_encode(getAllProjects());
}

function updateProjectAndRefresh($idProject){
    // GESTION DE LA MINIATURE
    if(isset($_FILES['miniature'])){
        $infosfichier = pathinfo($_FILES['miniature']['name']);
        $extension = $infosfichier['extension'];
        $extensions_images = array('jpg', 'jpeg', 'gif', 'png');
    
        if (in_array($extension, $extensions_images)) {
            //récupérer chemin image
            $miniaturePath = getProjectMiniature($idProject);
    
            //supprimer image
            unlink('.'.$miniaturePath[0]);

            //insertion de l'image dans les dossiers
            move_uploaded_file($_FILES['miniature']['tmp_name'], '../img/gallery/miniatures/'.basename($_FILES['miniature']['name']));
            $cheminfichier='./img/gallery/miniatures/'.basename($_FILES['miniature']['name']);
            
            updateProjectMiniature($cheminfichier, $idProject);
        }
    }

    // GESTION DES CATÉGORIES MULTIPLES DU PROJET
    //Suppression des catégories liées précédentes
    deleteAllCategoriesOfAProject($idProject);

    //Ajout des nouvelles catégories
    $categories = json_decode($_POST['categorie']);
    foreach($categories as $value){
        UpdateProjectToCategory($idProject, $value);
    }

    // GESTION DES AUTRES INFORMATIONS DU PROJET
    updateProject($_POST['titre'], $_POST['date'], $_POST['technique'], $_POST['description'], $idProject);

    return json_encode(getAllProjects());
}