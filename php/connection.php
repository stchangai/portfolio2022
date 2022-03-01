<?php 
// CONSTANTES 
define ('BASE', 'portfolio'); 
define ('USERNAME', 'root'); 
define ('PASSWORD', ''); 
 
// CONNEXION À LA BASE DE DONNÉES 
function connection(){ 
    $cnx = new PDO('mysql:host=localhost;dbname='.BASE.';charset=utf8', USERNAME, PASSWORD); 
    $cnx->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
 
    return $cnx; 
}
