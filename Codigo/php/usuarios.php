<?php
//aparatdop de decraraciones he inportaciones
require_once('../php/permisos.php');


// indicamos la declaracion de variables grovales y importacion de recursos
require_once('conet.php');
$con = new Conexion();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // echo "esto es un get";
    if(isset($_GET['lista'])){
        $lista = $_GET['lista'];
        // echo $lista;
        switch($lista){
            case 'directores':
                listaDirectores();
                break;
            case 'monitores':
                listaMonitores();
                break;
            case 'socios':
                // echo "lista de socios";
                if(isset($_GET['id_socio'])){
                    // echo $_GET['id_socio'];
                    listaSocios($_GET['id_socio']);
                }else{
                    listaSocios();
                }
                break;
            case 'familiares':
                familiaresDelSocio($_GET['id_socio']);
                echo "lista de socios";
                break;
            case 'responsable':
                // echo "lista de responsable";
                responsableMonitor();
                break;
        }
    }
    // try {
    //     $sql = "SELECT * FROM usuario WHERE 1";
    //     $result = $con->query($sql);
    //     //comprovamos que alla resultado
    //     // if($result->num_rows == 0 ){
    //         //     header("HTTP/1.1 406 Not Acceptable");
    //         // }else{
    //         // }
    //         $usuario = $result->fetch_all(MYSQLI_ASSOC);
    //         print_r($sql);
    //         echo json_encode($usuario);
    //     }
    //     catch (mysqli_sql_exception $e) {
    //         header("HTTP/1.1 404 Not Found");
    //     }
    // exit;
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
                crearSocio($datos);
                // echo" \n crear socio";
            }else if ($datos->tipeRol == "monitor"){
                crearMonitor($datos);
                //  echo" \n crear monitor";
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
if ($_SERVER['REQUEST_METHOD'] == 'PUT'){
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        if(checkMonitor() || checkDirector()){
            if(isset($datos->tipeRol)){
                if($datos->tipeRol == "socios"){
                    modificarSocio($datos);
                    // echo" \n crear socio";
                }else if ($datos->tipeRol == "monitor"){
                    modificarMonitor($datos);
                    //  echo" \n crear monitor";
                }else if ($datos->tipeRol == "director"){
                    modificarDirector($datos);
                    // echo" \n crear director";
                }else if ($datos->tipeRol == "familiar"){
                    modificarFamiliar($datos);
                }else{
                    echo" \n formulario no registrado";
                }
            
        }else {
            header("HTTP/1.1 401 Unauthorized");
            echo "Usuario no autorizado";
        }
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if(checkDirector()){
        if(isset($_GET['id'] )&& isset($_GET['tipo_user'])){
            $tipo_user = $_GET['tipo_user'];
            $id= $_GET['id'];
            echo $id;
            echo $tipo_user;
            switch($tipo_user){
                case 'director':
                    $sql = "DELETE FROM `director` WHERE `director`.`id_d` = '$id'";
                    break;
                case 'monitor':
                    $sql = "DELETE FROM monitor WHERE `monitor`.`id_m` = '$id'";
                    break;
                case 'socios':
                    $sql = "DELETE FROM socios WHERE `socios`.`id_s` = '$id'";
                    break;
                case 'familiares':
                    $sql = "DELETE FROM `familiar` WHERE `familiar`.`id_f` = '$id'";
                    break;
                case 'usuarios':
                    $sql = "DELETE FROM usuario WHERE `usuario`.`id_u` = '$id'";
                    break;
                default:
                    echo 'form incorrecto';
                    break;
            }
            if(isset($sql)){
                $con->query($sql);
                header("HTTP/1.1 201 Created");
            }else{
                echo 'form incorrecto';
            }
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
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
            $gmail_d = $datos -> gmail_d;
            $club = $datos -> club;
            $fecha_elec = $datos -> fecha_elec;
            $sql = "INSERT INTO `director` (`id_d`, `id_u`, `nom_d`, `apel1_d`, `apel2_d`, `gmail_d`, `club`, `fecha_eleccion`)
                    VALUES (NULL, '$id_u', '$nom_d', '$apel1_d', '$apel2_d', '$gmail_d', '$club', '$fecha_elec');";
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
    
            $sql = "INSERT INTO `monitor` (`id_m`, `id_u`, `id_d`, `nom_m`, `apel1_m`, `apel2_m`, `tlf_m`, `curso_m`, `gmail_m`, `carne_conducir`, `titulo_monitor`) 
                    VALUES (NULL, '$id_u', '$id_d', '$nom_m', '$apel1_m', '$apel2_m', '$tlf_m', '$curso_m', '$gmail_m', '$carne_conducir', '$titulo_monitor');";
            // echo $sql;
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
        try {
            // Object { id_u: 30, curso_s: "4ºepo", nom_s: "socio", apel1_s: "socio", apel2_s: "socio", fechNac: "2023-11-21", tlf_s: NULL, colegio: "teresianas", fecha_inscrip: "2023-11-22", observacines: "ninguna" }
            $id_u = $datos->id_u;
            $curso_s = $datos->curso_s;
            $nom_s = $datos->nom_s;
            $apel1_s = $datos->apel1_s;
            $apel2_s = $datos->apel2_s;
            $fechNac = $datos->fechNac;
            $tlf_s = $datos->tlf_s;
            $colegio = $datos->colegio;
            $fecha_inscrip = $datos->fecha_inscrip;
            $observacines = $datos->observacines;
            $familiares = $datos->familiares;
            if(isset($familiares)){
                // print_r($familiares);
                if(count($familiares) == 0){
                    header("HTTP/1.1 500 Internal Server Error");
                    echo "no hay familiares";
                    exit;
                }else{
                    foreach($familiares as $familiar){
                        crearFamiliar($familiar);
                    }
                }
            }
            $sql = "INSERT INTO `socios` (`id_s`, `id_u`, `curso_s`, `nom_s`, `apel1_s`, `apel2_s`, `fechNac`, `tlf_s`, `colegio`, `fecha_inscrip`, `observacines`)
                    VALUES (NULL, '$id_u', '$curso_s', '$nom_s', '$apel1_s', '$apel2_s', '$fechNac', $tlf_s, '$colegio', '$fecha_inscrip', '$observacines');";

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
function crearFamiliar($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 2, nom_f: "familar", apel1_f: "familiar", apel2_f: "familiar", tlf_f: "444555666", direccion: "republica argentina 2d", localidad: "leon", cp: "24007", parentesco: "familiar", gmail_f: "familiar@gmail.com", id_s: "2" }
            $id_u = $datos->id_u;
            $nom_f = $datos->nom_f;
            $apel1_f = $datos->apel1_f;
            $apel2_f = $datos->apel2_f;
            $tlf_f = $datos->tlf_f;
            $direccion = $datos->direccion;
            $localidad = $datos->localidad;
            $cp = $datos->cp;
            $parentesco = $datos->parentesco;
            $gmail_f = $datos->gmail_f;
            $id_s = $datos->id_s;
    
            $sql = "INSERT INTO `familiar` (`id_u`, `nom_f`, `apel1_f`, `apel2_f`, `tlf_f`, `direccion`, `localidad`, `cp`, `parentesco`, `gmail_f`, `id_s`)
                    VALUES ('$id_u', '$nom_f', '$apel1_f', '$apel2_f', '$tlf_f', '$direccion', '$localidad', '$cp', '$parentesco', '$gmail_f', '$id_s');";
            // echo $sql;
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
            return $con->insert_id;
    
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}

// consultas para consultar y sacar listas de los usarios
function listaDirectores($id_d = 0){
    $con = new Conexion();
    if(checkDirector()){
        try{
            if($id_d > 0){
                $sql = "SELECT * FROM `director` WHERE 1 AND id_d = $id_d";
            }else{
                $sql = "SELECT * FROM `director` WHERE 1";
            }
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function listaSocios($id_s = 0){
    $con = new Conexion();
    if(checkDirector() || checkMonitor()){
        // SELECT * FROM familiar WHERE id_s = 2; 
        if(isset($_GET['id_socio'])){
            $id_s = $_GET['id_socio'];
            $sql = "SELECT * FROM `socios` WHERE 1 AND id_s = $id_s";
        }else if(isset($_GET['curso'])){
            $curso = $_GET['curso'];
            $sql = "SELECT * FROM `socios` WHERE 1 AND socios.curso_s LIKE '$curso'";
        }else{
            $sql = "SELECT * FROM `socios` WHERE 1";
        }
        try{
            // // echo "ID DEL USUARIO $id_s";
            // // $sql = "SELECT * FROM `socios` WHERE 1";
            // if($id_s > 0){
            //     $sql = "SELECT * FROM `socios` WHERE 1 AND id_s = $id_s";
            // }else if($curso_s == ""){
            //     $sql = "SELECT * FROM `socios` WHERE 1 AND socios.curso_s LIKE '4epo'";
            // }else{
            //     $sql = "SELECT * FROM `socios` WHERE 1";
            // }
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }
}
function listaMonitores(){
    $con = new Conexion();
    if(isset($_GET['id_monitor'])){
        $id_m = $_GET['id_monitor'];
        $sql = "SELECT * FROM `monitor` WHERE 1 and id_m = $id_m;";
    }else if(isset($_GET['curso'])){
        $curso = $_GET['curso'];
        $sql = "SELECT * FROM `monitor` WHERE 1 and curso_m like '$curso'";
    }else{
        $sql = "SELECT * FROM `monitor` WHERE 1";
    }

    if(checkDirector() || checkMonitor()){

        try{
            echo $sql;
            $result = $con->query($sql);
            // print_r($result);
            $monitores = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($monitores);
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 406 Not Acceptable");
        }
    }else{
        header("HTTP/1.1 401 Unauthorized");
    }
}
function responsableMonitor(){
    $con = new Conexion();
    // SELECT nom_d, apel1_d, apel2_d FROM monitor INNER JOIN director on monitor.id_d = director.id_d;
    if(isset($_GET['id_m'])){
        $idMonitor = $_GET['id_m'];
        if(checkDirector() || checkMonitor()){
            try{
                // echo $sql;
                $sql = "SELECT nom_d, apel1_d, apel2_d FROM monitor INNER JOIN director on monitor.id_d = director.id_d WHERE 1 AND id_m = $idMonitor";
                $result = $con->query($sql);
                // print_r($result);
                $responsable = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($responsable);
            }catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 402 Payment Required");
            }
        }else{
            header("HTTP/1.1 401 Unauthorized");
        }
    }else{
        header("HTTP/1.1 406 Not Acceptable");
    }
}
function familiaresDelSocio($id_s = 0){
    $con = new Conexion();
    if(checkDirector() || checkMonitor() ){
        // SELECT * FROM familiar WHERE id_s = 2; 
        try{
            if(isset($id_s)){
                $sql = "SELECT * FROM familiar WHERE id_s = $id_s;";
                $result = $con->query($sql);
                $familiares = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($familiares); 
            }else{
                header("HTTP/1.1 402 Payment Required");
            }
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 406 Not Acceptable");
            // header("HTTP/1.1 404 Not Found");
        }
    }
}
// - Modificar
function modificarUsuario($datos){
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
function modificarDirector($datos){
    $con = new Conexion();
    echo "director";
    if(checkDirector()){
        try{
            // Object { tipeRol: "director", nom_d: "", apel1_d: "", apel2_d: "", club: "", fecha_elec: "" }
            $id_d = $datos -> id_d;
            $id_u = $datos -> id_u;
            $nom_d = $datos -> nom_d;
            $apel1_d = $datos -> apel1_d;
            $apel2_d = $datos -> apel2_d;
            $gmail_d = $datos -> gmail_d;
            $club = $datos -> club;
            $fecha_elec = $datos -> fecha_elec;
            $sql = "UPDATE `director`  SET `id_u` = '$id_u', `nom_d` = '$nom_d', `apel1_d` = '$apel1_d', `apel2_d` = '$apel2_d',
            `gmail_d` = '$gmail_d', `club` = '$club', `fecha_eleccion` = '$fecha_elec' 
            WHERE `director`.`id_d` =$id_d;";
            // echo "\n $sql";
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
function modificarMonitor($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 28, id_d: 1, nom_m: "monitor", apel1_m: "monitor", apel2_m: "monitor", tlf_m: "222333444", curso_m: "4ºepo", carne_conducir: "1", titulo_monitor: "0" }
            $id_m = $datos->id_m;
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
    
            $sql = "UPDATE `monitor` SET
            `id_u` = '$id_u',
            `id_d` = '$id_d',
            `nom_m` = '$nom_m',
            `apel1_m` = '$apel1_m',
            `apel2_m` = '$apel2_m',
            `tlf_m` = '$tlf_m',
            `curso_m` = '$curso_m',
            `gmail_m` = '$gmail_m',
            `carne_conducir` = '$carne_conducir',
            `titulo_monitor` = '$titulo_monitor'
            WHERE `monitor`.`id_m` = $id_m;";
            // echo $sql;
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
function modificarSocio($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 30, curso_s: "4ºepo", nom_s: "socio", apel1_s: "socio", apel2_s: "socio", fechNac: "2023-11-21", tlf_s: NULL, colegio: "teresianas", fecha_inscrip: "2023-11-22", observacines: "ninguna" }
            $id_s = $datos->id_s;
            $id_u = $datos->id_u;
            $curso_s = $datos->curso_s;
            $nom_s = $datos->nom_s;
            $apel1_s = $datos->apel1_s;
            $apel2_s = $datos->apel2_s;
            $fechNac = $datos->fechNac;
            $tlf_s = $datos->tlf_s;
            $colegio = $datos->colegio;
            $fecha_inscrip = $datos->fecha_inscrip;
            $observacines = $datos->observacines;
            $sql = "UPDATE `socios` SET
            `id_u` = '$id_u',
            `curso_s` = '$curso_s',
            `nom_s` = '$nom_s',
            `apel1_s` = '$apel1_s',
            `apel2_s` = '$apel2_s',
            `fechNac` = '$fechNac',
            `tlf_s` = '$tlf_s',
            `colegio` = '$colegio',
            `fecha_inscrip` = '$fecha_inscrip',
            `observacines` = '$observacines'
            WHERE `socios`.`id_s` = $id_s;";

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
function modificarFamiliar($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 2, nom_f: "familar", apel1_f: "familiar", apel2_f: "familiar", tlf_f: "444555666", direccion: "republica argentina 2d", localidad: "leon", cp: "24007", parentesco: "familiar", gmail_f: "familiar@gmail.com", id_s: "2" }
            $id_u = $datos->id_u;
            $id_f = $datos->id_f;
            $nom_f = $datos->nom_f;
            $apel1_f = $datos->apel1_f;
            $apel2_f = $datos->apel2_f;
            $tlf_f = $datos->tlf_f;
            $direccion = $datos->direccion;
            $localidad = $datos->localidad;
            $cp = $datos->cp;
            $parentesco = $datos->parentesco;
            $gmail_f = $datos->gmail_f;
            $id_s = $datos->id_s;
    
            $sql = "UPDATE `familiar` SET
            `id_u` = '$id_u',
            `nom_f` = '$nom_f',
            `apel1_f` = '$apel1_f',
            `apel2_f` = '$apel2_f',
            `tlf_f` = '$tlf_f',
            `direccion` = '$direccion',
            `localidad` = '$localidad',
            `cp` = '$cp',
            `parentesco` = '$parentesco',
            `gmail_f` = '$gmail_f',
            `id_s` = '$id_s'
            WHERE `familiar`.`id_f` = $id_f;";
    
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
            return $con->insert_id;
    
        }catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 404 Not Found");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
?>