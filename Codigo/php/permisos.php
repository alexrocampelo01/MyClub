<?php
// importamos la libreria que estamos usando
require '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
define('CLAVEJWT','X7pe{B1U3%q>');
//obtenemos el webToken del header
function obtenerJWT(){
    $headers = getallheaders();
    // print_r($headers['webToken']);
    if(isset($headers['webToken'])){
        $jwt = $headers['webToken'];
    }else{
        // lanzamos un error si no se encuentra
        header("HTTP/1.1 401 Unauthorized");
        echo "falta token";
        exit;
    }
    // echo $jwt;
    return $jwt;
}

//creador de webtoken 
function generateWebToken ($userRol, $userName){
    $playLoad = array(
        "userRol" => "$userRol",
        "userNom" => "$userName",
    );
    $jwt = JWT::encode($playLoad, CLAVEJWT, 'HS256');
    return $jwt;
}
// comprobar permisos del jwt obtenido en el header
function comprobarPermisos(){
    $jwt = obtenerJWT();
    try{
        //echo $jwt;
        $usarios = JWT::decode($jwt, new Key(CLAVEJWT, 'HS256'));
        //echo $usarios;
        //print_r($usarios);
        return $usarios->userRol;
    }catch (Exception $e){
        header("HTTP/1.1 401 Unauthorized");
        echo "Usuario no autorizado";
    }
}
//tipo de usarios para permisos
// director
// monitor
// socios 
// padres
function checkDirector(){
    return comprobarPermisos() == "director";
}
function checkMonitor(){
    return comprobarPermisos() == "monitor";
}
function checkPadres(){
    return comprobarPermisos() == "padres";
}
function checkSocio(){
    return comprobarPermisos() == "socios";
}


?>