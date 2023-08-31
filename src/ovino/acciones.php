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

    $sql = "INSERT INTO ovinos (nombre, color, sexo, fecha_nacimiento, nombre_madre, nombre_padre, nota)
            VALUES ('$nombre', '$color', '$sexo', '$fechaNacimiento', '$nombreMadre', '$nombrePadre', '$nota')";

    if ($conexion->query($sql) === TRUE) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "mostrarOvinos") {
    $sql = "SELECT * FROM ovinos ORDER BY id DESC";
    $resultado = $conexion->query($sql);

    $ovinos = array();
    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $ovinos[] = $row;
        }
    }

    echo json_encode(array("ovinos" => $ovinos));
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["accion"]) && $_GET["accion"] === "eliminarOvino" && isset($_GET["id"])) {
    $idOvino = $_GET["id"];
    
    // Eliminar las dosis asociadas al ovino en la tabla dosisovinos
    $sqlEliminarDosis = "DELETE FROM dosisovinos WHERE id_ovino = $idOvino";
    if ($conexion->query($sqlEliminarDosis) === TRUE) {
        // Ahora, eliminar el ovino de la tabla ovinos
        $sqlEliminarOvino = "DELETE FROM ovinos WHERE id = $idOvino";

        if ($conexion->query($sqlEliminarOvino) === TRUE) {
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
