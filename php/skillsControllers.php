<?php
// IMPORTATION DES MODELS
require_once('skillsModels.php');

// CONTROLEURS

function getAllSkillsByCategoryAsJSON(){
    $categories = getAllSkillCategories();

    foreach($categories as $category){
        $skillsByCategory[$category['nom']]['idCategory'] = $category['idCategorie'];

        $skills = getAllSkillsFromACategory($category['idCategorie']);
        $skillsByCategory[$category['nom']]['skills'] = $skills;

    }

    return json_encode($skillsByCategory);
}

function getSkillAsJSON($idSkill){
    return json_encode(getSkill($idSkill));
}

function deleteSkillAndRefresh($idSkill) {
    deleteSkill($idSkill);
}

function addSkillAndRefresh() {

    addSkill();

    return getAllSkillsByCategoryAsJSON();
}


function updateSkillAndRefresh($idSkill) {
    // GESTION DE L'ICONE
    if(isset($_FILES['icone'])){
        $infosfichier = pathinfo($_FILES['icone']['name']);
        $extension = $infosfichier['extension'];
        $extensions_images = array('jpg', 'jpeg', 'gif', 'png');

        if (in_array($extension, $extensions_images)) {
            //récupère le chemin de l'icone
            $iconPath = getSkillIcon($idSkill);

            //supprime l'icone précédente
            unlink('.'.$iconPath[0]);

            //ajoute la nouvelle icone
            move_uploaded_file($_FILES['icone']['tmp_name'], '../img/skills/'.$idSkill.".".$extension);
            $cheminfichier ='./img/skills/'.$idSkill.".".$extension;

            updateSkillIcon($cheminfichier, $idSkill);          
        }   
    }

    // GESTION DES AUTRES INFORMATIONS
    updateSkillInfos($_POST['outil'], $_POST['description'], $_POST['categorie'], $idSkill);

    return getAllSkillsByCategoryAsJSON();
}