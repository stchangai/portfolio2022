<?php
// IMPORTATION DES CONTROLEURS
require_once('mediaControllers.php');

// ROUTEUR

$request = explode('/', $_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];

switch($request[4]){
    case "medium":
        switch($method){
            case 'GET':
                echo getMediumAsJSONByIDMedium($request[5]);
                break;
            case 'POST':
                
                if($request[5] == "newMedium"){
                     echo addMediumToAProject();
                }
                else{
                    echo updateMediumAndRefresh($request[5]);
                }
                break;
            case 'PUT':
                //$json = file_get_contents('php://input');
                //echo updateMediumAndRefresh($request[6]);
                break;
            case 'DELETE':
                echo deleteMediumAndRefresh($request[5]);
                break;
            default:
                http_response_code('404');
                echo 'OUPSI !';
                break;
        }
        break;
    case 'media':
        switch($method){
            case 'GET':
                echo getMediaAsJSONbyIDProject($request[5]);
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