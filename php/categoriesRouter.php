<?php
// IMPORTATION DES CONTROLEURS
require_once('categoriesControllers.php');

// ROUTEUR

$request = explode('/', $_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];
    
//var_dump($request);
switch($request[4]){
    case 'category' :
        switch($method){
            case 'GET':
                echo getCategoryAsJSON($request[5]);
                break;

            case 'POST':
                $json = file_get_contents('php://input');
                echo addCategoryAndRefresh($json);
                break;

            case 'PUT':
                break;

            case 'DELETE':
                echo deleteACategoryAndRefresh($request[5]);
                break;

            default:
                http_response_code('404');
                echo 'OUPSI !';
                break;
        }
        break;

    case 'categories':
        switch($method){
            case 'GET':
                echo getAllCategoriesAsJson();
                break;
            case 'POST':
                
                break;
            case 'PUT':
                
                break;
            case 'DELETE':

                break;
            default:
                http_response_code('404');
                echo 'OUPSI !';
                break;
        }
        break;
    default :
        http_response_code('500');
        echo 'unknown endpoint';
        break;
}