<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vetganado";

$conexion = new mysqli($servername, $username, $password, $dbname);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "mostrarVacas") {
    $sql = "SELECT id, nombre, color, fecha_nacimiento FROM vacas";
    $resultado = $conexion->query($sql);

    $vacas = array();
    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $vacas[] = $row;
        }
    }

    echo json_encode(array("vacas" => $vacas));
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_GET["accion"]) && $_GET["accion"] === "agregarDosis") {
    $idVaca = $_POST["idVaca"];
    $fechaDosis = $_POST["fechaDosis"];
    $actividad = $_POST["actividad"];
    $producto = $_POST["producto"];
    $dosis = $_POST["dosis"];
    $diasProximaDosis = $_POST["diasProximaDosis"];
    $observaciones = $_POST["observaciones"];

    $sql = "INSERT INTO dosisvacas (id_vaca, Fecha, actividad, producto, dosis, dias, observaciones)
            VALUES ('$idVaca', '$fechaDosis', '$actividad', '$producto', '$dosis', '$diasProximaDosis', '$observaciones')";

    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "mostrarDosis" && isset($_GET["id"])) {
    $idVaca = $_GET["id"];
    $sql = "SELECT * FROM dosisvacas WHERE id_vaca = $idVaca ORDER BY Fecha DESC";
    $resultado = $conexion->query($sql);

    $dosis = array();
    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $dosis[] = $row;
        }
    }

    echo json_encode(array("dosis" => $dosis));
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "eliminarDosis" && isset($_GET["id"])) {
    $idDosis = $_GET["id"];
    $sql = "DELETE FROM dosisvacas WHERE id = $idDosis";

    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
}

$conexion->close();
?>
