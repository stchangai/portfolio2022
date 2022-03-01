<?php
// IMPORTATION DES CONTROLEURS
require_once('skillsControllers.php');

// ROUTEUR

$request = explode('/', $_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];

switch($request[4]){
    case "skill":
        switch($method){
            case 'GET':
                echo getSkillAsJSON($request[5]);
                break;
            case 'POST':
                if ($request[5] == "newSkill") {
                    echo addSkillAndRefresh();
                } else {
                    echo updateSkillAndRefresh($request[5]);
                }
                break;
            case 'PUT':
                break;
            case 'DELETE':
                deleteSkillAndRefresh($request[5]);
                echo getAllSkillsByCategoryAsJSON();
                break;
            default:
                http_response_code('404');
                echo 'OUPSI !';
                break;
        }
        break;
    case 'skills':
        switch($method){
            case 'GET':
                echo getAllSkillsByCategoryAsJSON();
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