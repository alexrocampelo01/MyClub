<?php
//aparatdo de decraraciones he inportaciones
require_once('../php/permisos.php'); // importamos el php encargado de los permisos


// indicamos la declaracion de variables grovales y importacion de recursos
require_once('conet.php');
$con = new Conexion();
//
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // echo "esto es un get";
    if(isset($_GET['lista'])){
        $lista = $_GET['lista'];
        // echo $lista;
        switch($lista){
            case 'permisos':
                // echo "lista de permisos";
                $permiso = comprobarPermisos();
                echo json_encode($permiso);
                break;
            case 'usuarios':
                // echo "lista de usuarios";
                listaUsuarios();
                break;
            case 'directores':
                listaDirectores();
                break;
            case 'monitores':
                // echo "lista de socios";
                listaMonitores();
                break;
            case 'socios':
                // echo "lista de socios";
                listaSocios();
                break;
            case 'familiares':
                // echo "lista de familiares";
                listaFamiliares();
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
//relacionadas con la creacion de nuevos suarios
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //recogemos el contenido del body de la peticion
    $json = file_get_contents('php://input');
    //como usamao el protocolo de envio de datos JSON
    //decodificamos el JSON recivido
    $datos = json_decode($json);
    //comprobamos que el JSON seha valido sicno debolmeos un error
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        // print_r($datos);
        // enfuncion de la variable requiero a una funcion distinta
        // crearUsuario($datos);
        if(isset($datos->tipeform)){
            if($datos->tipeform == "usuario"){
                crearUsuario($datos);
            }else if ($datos->tipeform == "login"){
                login($datos);
            }else{
                echo" \n formulario no registrado";
            }
        }else{
            echo "informacion incorrecta";
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
            if(isset($datos->tipeform)){
                modificarUsuario($datos);
        }else {
            header("HTTP/1.1 401 Unauthorized");
            echo "Usuario no autorizado";
        }
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if(checkDirector()){
        if(isset($_GET['id'] )&& isset($_GET['tipo_user'])&& isset($_GET['id_u'])){
            $tipo_user = $_GET['tipo_user'];
            $id= $_GET['id'];
            $id_u= $_GET['id_u'];
            echo $tipo_user;
            echo $id;
            echo $id_u;
            switch($tipo_user){
                case 'director':
                    $sql = "DELETE FROM `director` WHERE `director`.`id` = $id;";
                    $sql2 = "DELETE FROM `usuarios` WHERE `usuarios`.`id` = $id_u;";
                    break;
                case 'monitor':
                    $sql = "DELETE FROM `monitores` WHERE `monitores`.`id` = $id;";
                    $sql2 = "DELETE FROM `usuarios` WHERE `usuarios`.`id` = $id_u;";
                    break;
                case 'socios':
                    $sql = "DELETE FROM `socios` WHERE `socios`.`id` = $id;";
                    $sql2 = "DELETE FROM `usuarios` WHERE `usuarios`.`id` = $id_u;";
                    break;
                case 'familiares':
                    $sql = "DELETE FROM `familiares` WHERE `familiares`.`id` = $id;";
                    $sql2 = "DELETE FROM `usuarios` WHERE `usuarios`.`id` = $id_u;";
                    break;
                default:
                    echo 'form incorrecto';
                    break;
            }
            if(isset($sql)){
                $con->query($sql);
                header("HTTP/1.1 201 Created");
            }
            if(isset($sql2)){
                $con->query($sql2);
            }else{
                echo 'form incorrecto';
            }
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
// realizamos el login 
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
            // print_r($usario);
            $jwt = generateWebToken($usario[0]['tipo_user'],$usario[0]['nom_usu']);
            echo json_encode($jwt);
        }else{
            // echo "no hay usario con esos datos";
            header("HTTP/1.1 406 Not Acceptable");
            
        } 
    }catch (mysqli_sql_exception $e) {
        // echo $e;
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
                // echo "ususario usado";
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
                $idUsu = $con->insert_id;
                header("HTTP/1.1 201 Created");

                $rol = $datos->rol;
                $rol->id_u = $idUsu;
                if($rol->tipeRol == "socio"){
                    crearSocio($rol);
                    // echo" \n crear socio";
                }else if ($rol->tipeRol == "monitor"){
                    crearMonitor($rol);
                    //  echo" \n crear monitor";
                }else if ($rol->tipeRol == "director"){
                    crearDirector($rol);
                    // echo" \n crear director";
                }else if ($rol->tipeRol == "familiar"){
                    crearFamiliar($rol);
                    // echo" \n crear director";
                }              
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
            // print_r($datos);
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
                $observaciones = $datos->observaciones;
                $fechNac = $datos->fechNac;
                $fecha_inscrip = $datos->fecha_inscrip;
                $sql = "INSERT INTO `socios` (`id`, `id_u`, `curso`, `colegio`, `observaciones`, `fechaNacimiento`, `fechaInscrip`) VALUES
                (NULL, '$id_u', '$curso_s', '$colegio', '$observaciones', '$fechNac', '$fecha_inscrip');";

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
                $sql = "SELECT * FROM `usuarios` WHERE 1";
            }
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
             echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
function listaDirectores(){
    // echo "LISTA DIRECTOR \n";
    $con = new Conexion();
    // print_r($_GET);
    if(isset($_GET['club'])){
        echo "club";
        $club = $_GET['club'];
        $sql = "SELECT * FROM director WHERE club LIKE '%$club%'; ";
    }else if(isset($_GET['id'])){
        // echo "ID \n ";
        $id_d = $_GET['id'];
        $sql = "SELECT director.id AS id_r, director.*, usuarios.*
                FROM `director` INNER JOIN usuarios ON director.id_u = usuarios.id 
                WHERE 1 AND director.id = $id_d";
    }else if(isset($_GET['nombre'])){
        // echo "nombres";
        $sql = "SELECT director.id, nom, apel1, apel2 FROM `director`INNER JOIN usuarios on director.id_u = usuarios.id WHERE 1; ";
    }else{
        $sql = "SELECT director.id AS id_d, usuarios.id AS id_usuarios, director.*, usuarios.* 
                FROM `director` INNER JOIN `usuarios` ON usuarios.id = director.id_u 
                WHERE 1;";
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
function listaMonitores(){
    // echo "LISTA MONITORES \n";
    $con = new Conexion();
    // print_r($_GET);
    if(isset($_GET['id'])){
        $id_m = $_GET['id'];
        $sql = "SELECT monitores.id AS id_r, monitores.*, usuarios.*  FROM `monitores` INNER JOIN usuarios ON monitores.id_u = usuarios.id WHERE 1 AND monitores.id = $id_m;";
    }else if(isset($_GET['curso'])){
        $curso = $_GET['curso'];
        $sql = "SELECT * FROM `monitor` WHERE 1 and curso_m like '$curso'";
    }else if(isset($_GET['nombres'])){
        $sql = "SELECT monitores.id, usuarios.nom, usuarios.apel1 FROM `monitores` INNER JOIN usuarios ON monitores.id_u = usuarios.id WHERE 1; ";
    }
    else{
        $sql = "SELECT monitores.id AS id_m, usuarios.id AS id_usuarios, monitores.*, usuarios.* 
        FROM `monitores` INNER JOIN `usuarios` ON usuarios.id = monitores.id_u 
        WHERE 1";
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
    }else if(isset($_GET['nombres'])){
        // echo "caso de solo nombres";
        if(checkDirector() || checkMonitor() || checkFamiliar() || checkSocio()){
            $result = $con->query($sql);
            // print_r($result);
            $monitores = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($monitores);
        }else{
            header("HTTP/1.1 401 Unauthorized");
        }
    }else{
        header("HTTP/1.1 401 Unauthorized");
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
function listaSocios($id_s = 0){ // revisar
    $con = new Conexion();
    if(checkDirector() || checkMonitor()){
        if(isset($_GET['id'])){
            $id_s = $_GET['id'];
            $sql = "SELECT socios.id AS id_r, socios.*, usuarios.*
            FROM `socios` INNER JOIN usuarios ON socios.id_u = usuarios.id 
            WHERE 1 AND socios.id = $id_s;";
        }else if(isset($_GET['nombres'])){
           $sql = "SELECT socios.id, usuarios.nom, usuarios.apel1, usuarios.apel2 FROM `socios` INNER JOIN usuarios ON socios.id_u = usuarios.id WHERE 1; ";
        }
        else{
            $sql = "SELECT socios.id AS id_socio, usuarios.id AS id_usuarios, socios.*, usuarios.* 
                    FROM `socios` INNER JOIN `usuarios` ON usuarios.id = socios.id_u 
                    WHERE 1;";
        }
        try{
            // echo $sql;
            $result = $con->query($sql);
            $socios = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($socios);
        }catch (mysqli_sql_exception $e) {
             echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
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
function listaFamiliares(){
    // echo "lista de familiares";
    $con = new Conexion();
    if(checkDirector() || checkMonitor()){
        try{
            if(isset($_GET['id'])){
                $id_f = $_GET['id'];
                $sql = "SELECT familiares.id AS id_r, familiares.*, usuarios.*
                        FROM `familiares` INNER JOIN usuarios ON familiares.id_u = usuarios.id
                        WHERE 1 AND familiares.id = $id_f";
            }else{
                $sql = "SELECT familiares.id AS id_f, usuarios.id AS id_usuarios, familiares.*, usuarios.* 
                FROM `familiares` INNER JOIN `usuarios` ON usuarios.id = familiares.id_u 
                WHERE 1";
            }
            // echo $sql;
            $result = $con->query($sql);
            $familiares = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($familiares);
        }catch (mysqli_sql_exception $e) {
             // echo $e;
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }

}

//------------------------------------------------------------------------

// - Modificar
function modificarUsuario($datos){
    $con = new Conexion();
    //echo "$permisos";
    if(checkDirector()){
        try {
            $id_u = $datos->id_u;
            $nomUsu = $datos->nom_usu;
            $nom = $datos->nom;
            $apel1 = $datos->apel1;
            $apel2 = $datos->apel2;
            $correo = $datos->correo;
            $tlf = $datos->tlf;
            $tipo_user = $datos->tipo_user;
            print_r($datos);
            // comprovamos que alla resultado
            $sql = "UPDATE `usuarios` 
                    SET `nom_usu` = '$nomUsu',
                    `nom` = '$nom',
                    `apel1` = '$apel1',
                    `apel2` = '$apel2',
                    `correo` = '$correo',
                    `tlf` = '$tlf'
                    WHERE `usuarios`.`id` = $id_u;";
            $con->query($sql);
            header("HTTP/1.1 201 Created");
            echo json_encode($con->insert_id);
            $rol = $datos->rol;
            if($rol->tipeRol == "socio"){
                modificarSocio($rol);
                // echo" \n crear socio";
            }else if ($rol->tipeRol == "monitor"){
                modificarMonitor($rol);
                //  echo" \n crear monitor";
            }else if ($rol->tipeRol == "director"){
                modificarDirector($rol);
                // echo" \n crear director";
            }else if ($rol->tipeRol == "familiar"){
                modificarFamiliar($rol);
                // echo" \n crear director";
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

function modificarDirector($datos){
    $con = new Conexion();
    if(checkDirector()){
        try{
            // Object { tipeRol: "director", nom_d: "", apel1_d: "", apel2_d: "", club: "", fecha_elec: "" }
            $id= $datos -> id_r;
            $club = $datos -> club;
            $fecha_elec = $datos -> fecha_elec;
            $sql = "UPDATE `director`
            SET `club` = '$club',
            `fechaEleccion` = '$fecha_elec'
            WHERE `director`.`id` = $id;";
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
            $id_rol = $datos->id_r;
            $id_d = $datos->id_d;
            $curso_m = $datos->curso_m;
            $carne_conducir = $datos->carne_conducir;
            $titulo_monitor = $datos->titulo_monitor;
    
            $sql = "UPDATE `monitores`
            SET `id_d` = '$id_d',
            `curso` = '$curso_m',
            `carne_c` = '$carne_conducir',
            `titulo_m` = '$titulo_monitor'
            WHERE `monitores`.`id` = $id_rol;";
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
    echo "modificar socio";
    if(checkDirector()){
        try {     
            $id_rol = $datos->id_r;
            $curso_s = $datos->curso_s;
            $colegio = $datos->colegio;
            $observaciones = $datos->observaciones;
            $fechNac = $datos->fechNac;
            $fecha_inscrip = $datos->fecha_inscrip;

            $sql = "UPDATE `socios`
            SET `curso` = '$curso_s',
            `colegio` = '$colegio',
            `observaciones` = '$observaciones',
            `fechaNacimiento` = '$fechNac',
            `fechaInscrip` = '$fecha_inscrip'
            WHERE `socios`.`id` = $id_rol;";
            echo $sql;
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
    echo "creo familiar";
    if(checkDirector()){
        try {
            $id_rol = $datos->id_r;
            $id_s = $datos->id_s;
            $direccion = $datos->dir;
            $localidad = $datos->loc;
            $cp = $datos->cp;
            $parentesco = $datos->parentesco; 
            
            $sql = "UPDATE `familiares` 
            SET `id_s` = '$id_s',
            `direccion` = '$direccion',
            `localidad` = '$localidad',
            `cp` = '$cp',
            `parentesco` = '$parentesco'
            WHERE `familiares`.`id` = $id_rol ;";
    
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