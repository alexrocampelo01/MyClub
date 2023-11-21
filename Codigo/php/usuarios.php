<?php
//aparatdop de decraraciones he inportaciones
require_once('../php/permisos.php');


// indicamos la declaracion de variables grovales y importacion de recursos
require_once('conet.php');
$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    echo "esto es un get";
    try {
        $sql = "SELECT * FROM usuario WHERE 1";
        $result = $con->query($sql);
        //comprovamos que alla resultado
        // if($result->num_rows == 0 ){
            //     header("HTTP/1.1 406 Not Acceptable");
            // }else{
            // }
            $usuario = $result->fetch_all(MYSQLI_ASSOC);
            print_r($sql);
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
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        // print_r($datos);
        if(isset($datos->tipeRol)){
            if($datos->tipeRol == "usuarios"){
                //echo "\n crear usuario";
                crearUsuario($datos);


            }else if($datos->tipeRol == "socios"){
                crearSocio($datas);
                // echo" \n crear socio";
            }else if ($datos->tipeRol == "monitor"){
                crearMonitor($datos);
                 echo" \n crear monitor";
            }else if ($datos->tipeRol == "director"){
                crearDirector($datos);
                // echo" \n crear director";
            }else if ($datos->tipeRol == "login"){
                login($datos);
            }else{
                echo" \n formulario no registrado";
            }
        }else{
            echo "no tiene tipo de usario";
            header("HTTP/1.1 406 Not Acceptable");
        }
    }
    exit;
}

function login($datos){
    $con = new Conexion();
    try {
        $nomUsu = $datos->nom_usu;
        $passUsu = $datos->pass_usu;
        $hashPass = hash('sha512', $passUsu);
        $sql = "SELECT * FROM `usuario` WHERE 1 AND nom_usu LIKE '$nomUsu' AND pass_usu LIKE '$hashPass'";
        $result = $con->query($sql);
        // comprovamos que alla resultado
        if($result->num_rows != 0 ){ 
            $usario = $result->fetch_all(MYSQLI_ASSOC);
            //print_r($usario);
            $jwt = generateWebToken($usario[0]['tipo_user'],$usario[0]['nom_usu']);
            echo json_encode($jwt);
        }else{
            echo "no hay usario con esos datos";
            header("HTTP/1.1 406 Not Acceptable");
            
        } 
    }catch (mysqli_sql_exception $e) {
        echo $e;
        header("HTTP/1.1 404 Not Found");
    }
}
//creamos un usario 
function crearUsuario($datos){
    $con = new Conexion();
    //echo "$permisos";
    if(checkDirector()){
        try {
            $nomUsu = $datos->nom_usu;
            $passUsu = $datos->pass_usu;
            $hashPass = hash('sha512', $passUsu);
            $sql = "SELECT * FROM `usuario` WHERE 1 AND nom_usu LIKE '$nomUsu';";
            $result = $con->query($sql);
            // comprovamos que alla resultado
            if($result->num_rows != 0 ){
                // echo "ya exsistente";
                header("HTTP/1.1 406 Not Acceptable");
            }else{
                $tipo_user = $datos->tipo_user;
                $sql = "INSERT INTO `usuario` (`id_u`, `nom_usu`, `pass_usu`, `tipo_user`) VALUES (NULL, '$nomUsu', '$hashPass', '$tipo_user');";
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
            } 
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
// id_d 	id_u 	nom_d 	apel1_d 	apel2_d 	club 	fecha_eleccion 	
function crearDirector($datos){
    $con = new Conexion();
    if(checkDirector()){
        try{
            // Object { tipeRol: "director", nom_d: "", apel1_d: "", apel2_d: "", club: "", fecha_elec: "" }
            $id_u = $datos -> id_u;
            $nom_d = $datos -> nom_d;
            $apel1_d = $datos -> apel1_d;
            $apel2_d = $datos -> apel2_d;
            $club = $datos -> club;
            $fecha_elec = $datos -> fecha_elec;
            $sql = "INSERT INTO `director` (`id_d`, `id_u`, `nom_d`, `apel1_d`, `apel2_d`, `club`, `fecha_eleccion`)
                    VALUES (NULL, '$id_u', '$nom_d', '$apel1_d', '$apel2_d', '$club', '$fecha_elec');";
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);

        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function crearMonitor($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 28, id_d: 1, nom_m: "monitor", apel1_m: "monitor", apel2_m: "monitor", tlf_m: "222333444", curso_m: "4ºepo", carne_conducir: "1", titulo_monitor: "0" }
            $id_u = $datos->id_u;
            $id_d = $datos->id_d;
            $nom_m = $datos->nom_m;
            $apel1_m = $datos->apel1_m;
            $apel2_m = $datos->apel2_m;
            $tlf_m = $datos->tlf_m;
            $curso_m = $datos->curso_m;
            $gmail_m = $datos->gmail_m;
            $carne_conducir = $datos->carne_conducir;
            $titulo_monitor = $datos->titulo_monitor;
    
            $sql = "INSERT INTO `monitor` INSERT INTO `monitor` (`id_m`, `id_u`, `id_d`, `nom_m`, `apel1_m`, `apel2_m`, `tlf_m`, `curso_m`, `gmail_m`, `carne_conducir`, `titulo_monitor`) 
                    VALUES (NULL, '$id_u', '$id_d', '$nom_m', '$apel1_m', '$apel2_m', '$tlf_m', '$curso_m', '$gmail_m', '$carne_conducir', '$titulo_monitor');";
    
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
    
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function crearSocio($datos){
    $con = new Conexion();
    if(checkDirector()){
        try{


        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function crearFamiliar($datos){
    $con = new Conexion();
    if(checkDirector()){
        try{


        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
?>