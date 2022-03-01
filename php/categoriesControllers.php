<?php
// IMPORTATION DES MODELS
require_once('categoriesModels.php');

// CONTROLEURS

function getCategoryAsJSON($idCategory){
    return json_encode(getCategory($idCategory));
}

function getAllCategoriesAsJson ()
{
    return json_encode(getAllCategories());
}

function deleteACategoryAndRefresh($idCategory) {
    return json_encode(deleteCategory($idCategory));
}

function addCategoryAndRefresh($form){
    $category = json_decode($form, true);
    addCategory(($category['nom']));
    return json_encode(getAllCategories());
}