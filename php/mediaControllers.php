<?php
// IMPORTATION DES MODELS
require_once('mediaModels.php');
require_once('galleryControllers.php');

// CONTROLEURS

function getMediaAsJSONbyIDProject($idProject) {
       return json_encode(getProjectMedia($idProject));
}

function getMediumAsJSONByIDMedium($idMedium) {
       return json_encode(getMedium($idMedium));
}

function addMediumToAProject() {

       //detection du type de fichier
       if (isset($_FILES['medium']) AND $_FILES['medium']['error'] == 0) {
              // Testons si l'extension est autorisée
              $infosfichier = pathinfo($_FILES['medium']['name']);
              $extension_upload = $infosfichier['extension'];
              $extensions_autorisees = array('jpg', 'jpeg', 'gif', 'png', 'mp4');
              $extensions_images = array('jpg', 'jpeg', 'gif', 'png');
              $extensions_videos = array('mp4');

       if (in_array($extension_upload, $extensions_autorisees)) {
              if (in_array($extension_upload, $extensions_images)) {
                     $typefichier = 'photo';
              }
              if (in_array($extension_upload, $extensions_videos)) {
                     $typefichier = 'video';
              }
       } else {
              echo "Type (extension) non conforme. Extensions acceptées : jpg, jpeg, gif, png, mp4.";
       }
       }

       addMedium($typefichier, $extension_upload);

       return getProjectAsJSON($_POST['idProjet']);
}

function deleteMediumAndRefresh($idMedium) {
       $idProjet = deleteMedium($idMedium);

       return getProjectAsJSON($idProjet);
}

function updateMediumAndRefresh($idMedium){
       $idProject = getIDprojectByIDMedia($idMedium);
       if (isset($_FILES['medium'])) {
              // Testons si l'extension est autorisée
              $infosfichier = pathinfo($_FILES['medium']['name']);
              $extension_upload = $infosfichier['extension'];
              $extensions_autorisees = array('jpg', 'jpeg', 'gif', 'png', 'mp4');
              $extensions_images = array('jpg', 'jpeg', 'gif', 'png');
              $extensions_videos = array('mp4');

              if (in_array($extension_upload, $extensions_autorisees)) {
                     if (in_array($extension_upload, $extensions_images)) {
                            $typefichier = 'photo';
                     }
                     if (in_array($extension_upload, $extensions_videos)) {
                            $typefichier = 'video';
                     }

                     // Suppression du média précédent
                     $mediumPath = getMediumSource($idMedium);
                     unlink('.'.$mediumPath);

                     //Insertion du nouveau medium dans les dossier
                     move_uploaded_file($_FILES['medium']['tmp_name'], '../img/gallery/'.$idProject."/".$idMedium.".".$extension_upload);
                     $cheminfichier = './img/gallery/'.$idProject."/".$idMedium.".".$extension_upload;
                     
                     updateMediumImage($typefichier, $cheminfichier, $idMedium);
              } 
              else{
                     echo "Type (extension) non conforme. Extensions acceptées : jpg, jpeg, gif, png, mp4.";
              }
       }
       updateMediumInfos($_POST['legende'], $idMedium);

       return getProjectAsJSON($idProject);
}

