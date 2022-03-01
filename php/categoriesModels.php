<?php
// IMPORTATION DE LA FONCTION "CONNECTION()"
require_once('connection.php');

// ACCESSEURS EN LECTURE
// Fonctions permettant de récupérer les informations
// de la BDD (commencent par "get...")
function getAllCategories() {
    $cnx = connection();
    $result = $cnx->query('select * from categories');
    return $result->fetchall(PDO::FETCH_ASSOC);
}

function getCategory($idCategory){
    $cnx = connection();
    $stmt = $cnx->prepare("SELECT idCategorie, nom, description from categories WHERE idCategorie=?");
    $stmt->execute(array($idCategory));
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    return $category;
}

// ACCESSEURS EN ÉCRITURE
// Fonctions permettant de modifier les informations
// de la BDD (commencent par "set...")



// MÉTHODES
// Fonctions permettant de manipuler les informations
// de la BDD en règles générales
// (commencent par "add..." ou "delete..." par exemple)
function deleteCategory($idCategory) {
    $cnx = connection();
    $rqt = $cnx->prepare('DELETE FROM categories WHERE idCategorie = ?');
    $rqt->execute(array($idCategory));
    return getAllCategories();
}

function addCategory($nom){
    $cnx = connection();
    $rqt = $cnx->prepare('INSERT INTO categories(nom) values(?)');
    $result = $rqt->execute(array($nom));
    //code d'erreur
    if($result){
        $error = $cnx->errorInfo();
    }
}