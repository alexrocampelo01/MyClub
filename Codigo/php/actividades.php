<?php
//aparatdop de decraraciones he inportaciones
require_once ('../php/permisos.php');

// indicamos la declaracion de variables grovales y importacion de recursos
require_once('conet.php');
$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // echo "esto es un get";
    $jwt = obtenerJWT();
    $permisos = ComprobarPermisos($jwt);
    print_r($permisos);
    try {
            $usuario = "actividad 1";
            echo json_encode($usuario);
        }
        catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    exit;
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    //print_r($datos);
    //echo "esto es un post";


}


?>