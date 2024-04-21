<?php
//aparatdo de decraraciones he inportaciones
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
            case 'usuarios':
                listaUsuarios();
                break;
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
            case 'clubNombres':
                // echo "lista de responsable";
                listaclubUnicos();
                break;
        }
    }else{
        echo "no hay lista";
        header("HTTP/1.1 406 Not Acceptable");
    }
}
//Recojemos todas la peticiones POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        // print_r($datos);
        if(isset($datos->tipeRol)){
            if($datos->tipeRol == "usuario"){
                crearUsuario($datos);
            }else if($datos->tipeRol == "socio"){
                crearSocio($datos);
                // echo" \n crear socio";
            }else if ($datos->tipeRol == "monitor"){
                crearMonitor($datos);
                //  echo" \n crear monitor";
            }else if ($datos->tipeRol == "director"){
                crearDirector($datos);
                // echo" \n crear director";
            }else if ($datos->tipeRol == "familiar"){
                crearFamiliar($datos);
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
        $sql = "SELECT * FROM `usuarios` WHERE 1 AND nom_usu LIKE '$nomUsu' AND pass LIKE '$hashPass'";
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
        header("HTTP/1.1 500 Internal Server Error");
    }
}
//creamos un usario 
function crearUsuario($datos){
    $con = new Conexion();
    // print_r($datos);
    if(checkDirector()){ // verificamos persos de director
        try {
            //comprobamos que no exixten usarios con mismo nombre
            $nomUsu = $datos->nom_usu;
            $passUsu = $datos->pass_usu;
            $hashPass = hash('sha512', $passUsu);
            $sql = "SELECT * FROM `usuarios` WHERE 1 AND nom_usu LIKE '$nomUsu';";
            $result = $con->query($sql);
            // lazamos un error
            if($result->num_rows != 0 ){
                header("HTTP/1.1 406 Not Acceptable");
            }else{ // creamos el usario
                $nom = $datos->nom;
                $apel1 = $datos->apel1;
                $apel2 = $datos->apel2;
                $correo = $datos->correo;
                $tlf = $datos->tlf;
                $tipo_user = $datos->tipo_user;
                $sql = "INSERT INTO `usuarios` (`id`, `nom_usu`, `pass`, `nom`, `apel1`, `apel2`, `correo`, `tlf`, `tipo_user`) VALUES
                (NULL, '$nomUsu', '$hashPass', '$nom', '$apel1', '$apel2', '$correo', '$tlf', '$tipo_user')";
                // echo $sql;
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
            } 
        }catch (mysqli_sql_exception $e) {
            // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        echo "No autorizado";
        header("HTTP/1.1 401 Unauthorized");
    }
}
//creamos al director
function crearDirector($datos){
    $con = new Conexion();
    if(checkDirector()){
        try{
            $id_u = $datos -> id_u;
            // lazamos un error
            if(checkIdUserExsits($id_u)){ 
                $club = $datos -> club;
                $fecha_elec = $datos -> fecha_elec;
                $sql = "INSERT INTO `director` (`id`, `id_u`, `club`, `fechaEleccion`) VALUES
                        (NULL, '$id_u', '$club', '$fecha_elec');";
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
            }else{
                echo "id no exixte";
                header("HTTP/1.1 406 Not Acceptable");
            }
        }catch (mysqli_sql_exception $e) {
            // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        echo "No autorizado";
        header("HTTP/1.1 401 Unauthorized");
    }
}
//crear al monitor
function crearMonitor($datos){
    $con = new Conexion();
    if(checkDirector()){
        try {
            // Object { id_u: 28, id_d: 1, nom_m: "monitor", apel1_m: "monitor", apel2_m: "monitor", tlf_m: "222333444", curso_m: "4ºepo", carne_conducir: "1", titulo_monitor: "0" }
            $id_u = $datos->id_u;
            $id_d = $datos->id_d;
           if(checkIdUserExsits($id_u) && checkIdDirectorExsits($id_d)){
            $curso_m = $datos->curso_m;
            $carne_conducir = $datos->carne_conducir;
            $titulo_monitor = $datos->titulo_monitor;
    
            $sql = "INSERT INTO `monitores` (`id`, `id_u`, `id_d`, `curso`, `carne_c`, `titulo_m`) VALUES
             (NULL, '$id_u', '$id_d', '$curso_m', '$carne_conducir', '$titulo_monitor');";
            // echo $sql;
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
           }else{
            // echo "id no exixte";
            header("HTTP/1.1 406 Not Acceptable");
           }    
        } catch (mysqli_sql_exception $e) {
             // echo $e;
             header("HTTP/1.1 500 Internal Server Error");
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
            if(checkIdUserExsits($id_u)){
                $curso_s = $datos->curso_s;
                $colegio = $datos->colegio;
                $observacines = $datos->observacines;
                $fechNac = $datos->fechNac;
                $fecha_inscrip = $datos->fecha_inscrip;
                $familiares = $datos->familiares;
                $sql = "INSERT INTO `socios` (`id`, `id_u`, `curso`, `colegio`, `observaciones`, `fechaNacimiento`, `fechaInscrip`) VALUES
                (NULL, '$id_u', '$curso_s', '$colegio', '$observacines', '$fechNac', '$fecha_inscrip');";

                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
            }else{
            // echo "id no exixte";
            header("HTTP/1.1 406 Not Acceptable");
            }
    
        }catch (mysqli_sql_exception $e) {
             // echo $e;
             header("HTTP/1.1 500 Internal Server Error");
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
            $id_u = $datos->id_u;
            $id_s = $datos->id_s;
            if(checkIdUserExsits($id_u) && checkIdSocioExsits($id_s)){
                echo "creo familiar";
                $direccion = $datos->dir;
                $localidad = $datos->loc;
                $cp = $datos->cp;
                $parentesco = $datos->parentesco;    
                $sql = "INSERT INTO `familiares` (`id`, `id_u`, `id_s`, `direccion`, `localidad`, `cp`, `parentesco`)
                        VALUES (NULL, '$id_u', '$id_s', '$direccion', '$localidad', '$cp', '$parentesco');";
                // echo $sql;
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
                return $con->insert_id;
            }else{
            echo "id no exixte";
            header("HTTP/1.1 406 Not Acceptable");
            }
    
        }catch (mysqli_sql_exception $e) {
             // echo $e;
             header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}

// consultas para consultar y sacar listas de los usarios

function listaUsuarios($id_u = 0){
    $con = new Conexion();
    if(checkDirector()){
        try{
            $id_u = -1;
            if(isset($_GET['id_usuario'])){
                $id_u = $_GET['id_usuario'];
            }else{

            }
            if($id_u > 0){
                $sql = "SELECT * FROM `usuario` WHERE 1 AND id_u = $id_u";
            }else if(isset($club)){
                $sql = "SELECT * FROM `usuario` WHERE 1";
            }else{
                $sql = "SELECT * FROM `usuario` WHERE 1";
            }
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function listaDirectores($id_d = 0){
    $con = new Conexion();
    $sql = "SELECT * FROM `director` WHERE 1";
    // print_r($_GET);
    if(isset($_GET['club'])){
        echo "club";
        $club = $_GET['club'];
        $sql = "SELECT * FROM director WHERE club LIKE '%$club%'; ";
    }
    if(isset($_GET['id_d'])){
        echo "id_d";
        $id_d = $_GET['id_d'];
        $sql = "SELECT * FROM `director` WHERE 1 AND id = $id_d";
    }
    if(isset($_GET['nombre'])){
        // echo "nombres";
        $sql = "SELECT director.id, nom, apel1 FROM `director`INNER JOIN usuarios on director.id_u = usuarios.id WHERE 1; ";
    }
    // echo "director";
    if(checkDirector()){
        try{
            // echo $sql;
            $result = $con->query($sql);
            $director = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($director);
        }catch (mysqli_sql_exception $e) {
            echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function listaclubUnicos(){
    $con = new Conexion();
    if(checkDirector()){
        try{
            $sql = "SELECT DISTINCT club FROM `director`"; 
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function listaSocios($id_s = 0){
    $con = new Conexion();
    if(checkDirector() || checkMonitor()){
        if(isset($_GET['nombres'])){
            // echo "nombre";
            listaSociosNombres();
        }
        // else{
        //     // SELECT * FROM familiar WHERE id_s = 2; 
        //     if(isset($_GET['id_socio'])){
        //         $id_s = $_GET['id_socio'];
        //         $sql = "SELECT * FROM `socios` WHERE 1 AND id_s = $id_s";
        //     }else if(isset($_GET['curso'])){
        //         $curso = $_GET['curso'];
        //         $sql = "SELECT * FROM `socios` WHERE 1 AND socios.curso_s LIKE '$curso'";
        //     }else{
        //         $sql = "SELECT * FROM `socios` WHERE 1";
        //     }
        // }
        // try{
        //     $result = $con->query($sql);
        //     $socios = $result->fetch_all(MYSQLI_ASSOC);
        //     echo json_encode($socios);
        // }catch (mysqli_sql_exception $e) {
        //      echo $e;
        //     header("HTTP/1.1 500 Internal Server Error");
        // }
    }
}
function listaSociosNombres(){
    $con = new Conexion();
    $sql = "SELECT socios.id, usuarios.nom, usuarios.apel1 FROM `socios` INNER JOIN usuarios ON socios.id_u = usuarios.id WHERE 1; ";
    if(checkDirector() || checkMonitor()){
        try{
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }
}
function listaMonitores(){
    $con = new Conexion();
    // print_r($_GET);
    if(isset($_GET['id_monitor'])){
        $id_m = $_GET['id_monitor'];
        $sql = "SELECT * FROM `monitor` WHERE 1 and id_m = $id_m;";
    }else if(isset($_GET['curso'])){
        $curso = $_GET['curso'];
        $sql = "SELECT * FROM `monitor` WHERE 1 and curso_m like '$curso'";
    }else if(isset($_GET['nombres'])){
        $sql = "SELECT monitores.id, usuarios.nom, usuarios.apel1 FROM `monitores` INNER JOIN usuarios ON monitores.id_u = usuarios.id WHERE 1; ";
    }
    else{
        $sql = "SELECT * FROM `monitor` WHERE 1";
    }
    if(checkDirector() || checkMonitor()){

        try{
            // echo $sql;
            $result = $con->query($sql);
            // print_r($result);
            $monitores = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($monitores);
        }catch (mysqli_sql_exception $e) {
            $e;
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
            //  // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
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
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
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
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
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
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
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
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
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
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function checkIdUserExsits($id){ 
    $con = new Conexion();
    try{
        $sql = "SELECT * FROM `usuarios` WHERE 1 AND id = $id;";
        $result = $con->query($sql);
        // lazamos un error
        if($result->num_rows != 0 ){
            return true;
        }else{
            return false;
        }
    }catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}
function checkIdDirectorExsits($id){
    $con = new Conexion();
    try{
        $sql = "SELECT * FROM `director` WHERE 1 AND id = $id;";
        $result = $con->query($sql);
        // lazamos un error
        if($result->num_rows != 0 ){
            return true;
        }else{
            return false;
        }
    }catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}
function checkIdSocioExsits($id){
    $con = new Conexion();
    try{
        $sql = "SELECT * FROM `socios` WHERE 1 AND id = $id;";
        $result = $con->query($sql);
        // lazamos un error
        if($result->num_rows != 0 ){
            return true;
        }else{
            return false;
        }
    }catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}
?>