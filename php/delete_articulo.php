<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión"]));
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $clave = $_DELETE['clave'] ?? '';

    if (empty($clave)) {
        echo json_encode(["success" => false, "message" => "Clave no proporcionada"]);
        exit;
    }

    $sql = "DELETE FROM articulos WHERE clave = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $clave);
    $stmt->execute();

    echo json_encode([
        "success" => $stmt->affected_rows > 0,
        "message" => $stmt->affected_rows > 0 ? "Artículo eliminado correctamente" : "No se encontró el artículo",
        "affected_rows" => $stmt->affected_rows
    ]);

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "message" => "Método incorrecto"]);
}
?>
