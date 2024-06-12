<?php
//aparatdop de decraraciones he inportaciones
require_once ('../php/permisos.php');

// indicamos la declaracion de variables grovales y importacion de recursos
require_once('conet.php');
$con = new Conexion();
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if(checkDirector() || checkMonitor()){
        if(isset($_GET['filtro']) && isset($_GET['lista'])){
            $filtro = $_GET['filtro'];
            $lista = $_GET['lista'];
            if($lista == "fecha"){
                $sql = "SELECT * FROM `actividades` WHERE 1 and fechaHora = '$filtro'";
            }else if($lista == "rangoFechas"){
                $rangoFechas = explode(",", $filtro);
                // print_r($rangoFechas);
                $sql = "SELECT * FROM `actividades` WHERE 1 AND fechaHora_start BETWEEN '$rangoFechas[0]' AND '$rangoFechas[1]'"; 
            }else if($lista == "curso"){
                $sql = "SELECT * FROM `actividades` WHERE 1 and curso_ac like '$filtro' ";
            }else if($lista == "id"){
                $sql = "SELECT * FROM `actividades` WHERE 1 and id_ac = $filtro";
            }else if($lista == "fechaCurso"){
                $filtro = $_GET['filtro'];
                $filtro = json_decode($filtro);
                $fechaHora = $filtro -> fechaHora;
                $curso = $filtro -> curso;
                $sql = "SELECT * FROM `actividades` WHERE 1 and fechaHora = '$fechaHora' and curso_ac LIKE '$curso';";
            }else{
                $sql = "SELECT * FROM `actividades` WHERE 1 ";
            }
            try{
                // echo $sql;
                $result = $con->query($sql);
                // print_r($result);
                $actividades = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($actividades);
    
            }catch (mysqli_sql_exception $e) {
                echo $e;
                header("HTTP/1.1 404 Not Found");
            }
        }else{
            echo "sin filtros y sin lista";
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        $actividad = $datos;
        // print_r($actividad);
        if(checkDirector() || checkMonitor()){
            $id_m = $actividad->id_m;
            $titulo = $actividad->titulo;
            $fechStart = $actividad->fechaHora_start;
            $fechEnd = $actividad->fechaHora_end;
            $lugar = $actividad->lugar;
            $curso = $actividad->curso_ac;
            $descripcion = $actividad->descripcion;
            $material = $actividad->material;
            // INSERT INTO `actividades` (`id_ac`, `id_m`, `titulo`, `fechaHora`, `lugar`, `curso_ac`, `descripcion`, `material`) VALUES (NULL, '4', 'futbol', '2024-01-03 19:25:34', 'pabellon san juan bosco', '4epo', 'futbol', 'ninguno');
            try{
                $sql = "INSERT INTO `actividades` (`id`, `id_m`, `titulo`, `fechaHora_start`, `fechaHora_end`, `lugar`, `curso_ac`, `descripcion`, `material`)
                VALUES (NULL, '$id_m', '$titulo', '$fechStart', '$fechEnd', '$lugar', '$curso', '$descripcion ', '$material');";
                $con->query($sql);
                header("HTTP/1.1 201 Created");
                echo json_encode($con->insert_id);
        
            }catch (mysqli_sql_exception $e) {
                echo $e;
                header("HTTP/1.1 404 Not Found");
            }
        }else {
            header("HTTP/1.1 401 Unauthorized");
            echo "otro usarios $datos->tipo_user";
        }
    }
    //print_r($datos);
    //echo "esto es un post";


}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    if ($datos === null) {
        echo "JSON no valido";
        header("HTTP/1.1 406 Not Acceptable");
    }else{
        $actividad = $datos;
        // print_r($actividad);
        if(checkDirector() || checkMonitor()){
            $id = $actividad->id;
            $id_m = $actividad->id_m;
            $titulo = $actividad->titulo;
            $fechaHora_start = $actividad->fechaHora_start;
            $fechaHora_end = $actividad->fechaHora_end;
            $lugar = $actividad->lugar;
            $curso_ac = $actividad->curso_ac;
            $descripcion = $actividad->descripcion;
            $material = $actividad->material;
            try{
                $sql = "UPDATE `actividades` SET
                `id_m` = '$id_m',
                `titulo` = '$titulo',
                `fechaHora_start` = '$fechaHora_start',
                `fechaHora_end` = '$fechaHora_end',
                `lugar` = '$lugar',
                `curso_ac` = '$curso_ac',
                `descripcion` = '$descripcion',
                `material` = '$material'
                 WHERE `actividades`.`id` = $id;"; 
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
}
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if(checkDirector() || checkMonitor()){
        if(isset($_GET['id'])){
            $id= $_GET['id'];
            echo $id;
            $sql = "DELETE FROM `actividades` WHERE `actividades`.`id` = $id";
            $con->query($sql);
            header("HTTP/1.1 201 Created");
        }
    }else {
        header("HTTP/1.1 401 Unauthorized");
        echo "otro usarios $datos->tipo_user";
    }
}

?>