<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vetganado";

$conexion = new mysqli($servername, $username, $password, $dbname);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $color = $_POST["color"];
    $sexo = $_POST["sexo"];
    $fechaNacimiento = $_POST["fechaNacimiento"];
    $nombreMadre = $_POST["nombreMadre"];
    $nombrePadre = $_POST["nombrePadre"];
    $nota = $_POST["nota"];

    $sql = "INSERT INTO vacas (nombre, color, sexo, fecha_nacimiento, nombre_madre, nombre_padre, nota)
            VALUES ('$nombre', '$color', '$sexo', '$fechaNacimiento', '$nombreMadre', '$nombrePadre', '$nota')";

    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "mostrar") {
    $sql = "SELECT * FROM vacas ORDER BY id DESC";
    $resultado = $conexion->query($sql);

    $vacas = array();
    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $vacas[] = $row;
        }
    }

    echo json_encode(array("vacas" => $vacas));
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "eliminar" && isset($_GET["id"])) {
    $idVaca = $_GET["id"];
    
    // Eliminar las dosis asociadas a la vaca en la tabla dosisvacas
    $sqlEliminarDosis = "DELETE FROM dosisvacas WHERE id_vaca = $idVaca";
    if ($conexion->query($sqlEliminarDosis) === TRUE) {
        // Ahora, eliminar la vaca de la tabla vacas
        $sqlEliminarVaca = "DELETE FROM vacas WHERE id = $idVaca";

        if ($conexion->query($sqlEliminarVaca) === TRUE) {
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false));
        }
    } else {
        echo json_encode(array("success" => false));
    }
}

$conexion->close();
?>
