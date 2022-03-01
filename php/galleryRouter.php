<?php
// IMPORTATION DES CONTROLEURS
require_once('galleryControllers.php');

// ROUTEUR

$request = explode('/', $_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];

switch($request[4]){
    case "project":
        switch($method){
            case 'GET':
                echo getProjectAsJSON($request[5]);
                break;
            case 'POST':
                if($request[5] == "newProject"){
                    echo addProjectAndRefresh();
                }else{
                    echo updateProjectAndRefresh($request[5]);
                }
                break;
            case 'PUT':
                break;
            case 'DELETE':
                echo deleteProjectAndRefresh($request[5]);
                break;
            default:
                http_response_code('404');
                echo 'OUPSI !';
                break;
        }
        break;
    case "projects":
        switch($method){
            case 'GET':
                echo getAllProjectsAsJSON();
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
    case "category":
        switch($method){
            case 'GET':
                echo getAllProjectsFromACategoryAsJSON($request[5]);
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
        case "categories":
            switch($method){
                case 'GET':
                    echo getAllProjectsCategoriesAsJSON();
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
            case "ProjectCategories":
                switch($method){
                    case 'GET':
                        echo getAllCategoriesOfAProjectAsJSON($request[5]);
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