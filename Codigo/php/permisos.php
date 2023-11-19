<?php
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function obtenerJWT(){
    $headers = getallheaders();
    $jwt = $headers['webToken'];
    // echo $jwt;
    return $jwt;
}

//creador de webtoken 
function generateWebToken ($userRol, $userName){
    $claveJWT = 'X7pe{B1U3%q>';
    $playLoad = array(
        "userRol" => "$userRol",
        "userNom" => "$userName",
    );
    $jwt = JWT::encode($playLoad, $claveJWT, 'HS256');
    return $jwt;
}

function comprobarPermisos(){
    $claveJWT = 'X7pe{B1U3%q>';
    $jwt = obtenerJWT();
    try{
        //echo $jwt;
        $usarios = JWT::decode($jwt, new Key($claveJWT, 'HS256'));
        //echo $usarios;
        //print_r($usarios);
        return $usarios->userRol;
    }catch (Exception $e){
        echo"error de cofificar jwt ($e)";

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