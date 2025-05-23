<?php
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$resultado = $conexion->query("SELECT clave, descripcion, precio, imagen_url FROM articulos");
$articulos = [];

while ($fila = $resultado->fetch_assoc()) {
    $articulos[] = $fila;
}

echo json_encode(["success" => true, "data" => $articulos]);

$conexion->close();
?>
