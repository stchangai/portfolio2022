<?php
// IMPORTATION DE LA FONCTION "CONNECTION()"
require_once('connection.php');

// ACCESSEURS EN LECTURE
// Fonctions permettant de récupérer les informations
// de la BDD (commencent par "get...")

function getSkill($idSkill){
    $cnx = connection();
    $stmt = $cnx->prepare("SELECT idComp, idCategorie, outil AS nom, description, icone FROM competences WHERE idComp=?");
    $stmt->execute(array($idSkill));
    $skill = $stmt->fetch(PDO::FETCH_ASSOC);

    return $skill;
}

function getAllSkillCategories(){
    $cnx = connection();
    $result = $cnx->query('SELECT DISTINCT categories.idCategorie, categories.nom
    FROM categories, competences 
    WHERE categories.idCategorie = competences.idCategorie');
    
    return $result->fetchAll(PDO::FETCH_ASSOC);
}

function getAllSkillsFromACategory($idCategorie){
    $cnx = connection();
    $rqt = $cnx->prepare('SELECT competences.idComp, competences.outil
    FROM competences, categories
    WHERE categories.idCategorie = competences.idCategorie
    AND categories.idCategorie = ?');
    $rqt->execute(array($idCategorie));
    $result = $rqt->fetchAll(PDO::FETCH_ASSOC);
    
    return $result;
}

function getSkillIcon($idSkill){
    $cnx = connection();
    $rqt = $cnx->prepare('SELECT `icone` FROM `competences` WHERE `idComp`=?');
    $rqt->execute(array($idSkill));
    $iconPath = $rqt->fetch();

    return $iconPath;
}


// ACCESSEURS EN ÉCRITURE
// Fonctions permettant de modifier les informations
// de la BDD (commencent par "set...")

function updateSkillIcon($icone, $idSkill) {
    $cnx = connection();
    $rqt2 = $cnx->prepare('UPDATE competences 
                        SET icone = ?
                        WHERE idComp = ?');
    $rqt2->execute(array($icone, $idSkill));
}

function updateSkillInfos($outil, $description, $idCategorie, $idSkill) {
    $cnx = connection();
    $rqt2 = $cnx->prepare('UPDATE competences 
                        SET outil = ?, description = ?, idCategorie = ?
                        WHERE idComp = ?');
    $rqt2->execute(array($outil, $description, $idCategorie, $idSkill));
    //$rqt2->debugDumpParams();

}

// MÉTHODES
// Fonctions permettant de manipuler les informations
// de la BDD en règles générales
// (commencent par "add..." ou "delete..." par exemple)

function deleteSkill($idSkill) {
    $cnx = connection();

    //récupérer chemin image
    $rqt = $cnx->prepare('SELECT `icone` FROM `competences` WHERE `idComp`=?');
    $rqt->execute(array($idSkill));
    $pathImg = $rqt->fetch();

    //supprimer image
    unlink('.'.$pathImg[0]);

    //supprimer skill
    $rqt = $cnx->prepare('DELETE FROM competences WHERE idComp = ?');
    $rqt->execute(array($idSkill));
}

function addSkill() {
    $infosfichier = pathinfo($_FILES['icone']['name']);
    $extension = $infosfichier['extension'];

    // ajout skill
    $cnx = connection();
    $rqt = $cnx->prepare('INSERT INTO competences VALUES (NULL, ? ,? , ?, ?);');
    $rqt->execute(array($_POST['outil'], $_POST['description'], 'chemin temporaire', $_POST['categorie']));

    //recup id skill
    $rqt = $cnx->query('SELECT `idComp` FROM `competences` WHERE `icone`="chemin temporaire"');
    $idSkill = $rqt->fetch();

    //insertion de l'icone dans les documents
    move_uploaded_file($_FILES['icone']['tmp_name'], '../img/skills/'.$idSkill[0].".".$extension);
    $cheminfichier ='./img/skills/'.$idSkill[0].".".$extension;

    //correction de la bdd
    $rqt = $cnx->prepare( 'UPDATE competences SET icone = ? WHERE idComp = ?');
    $rqt->execute(array($cheminfichier, $idSkill[0]));     
}