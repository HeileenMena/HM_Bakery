<?php
header("Content-Type: application/json");

// Obtener datos manualmente
$clave       = $_POST['clave'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$precio      = $_POST['precio'] ?? '';
$imagen_url  = $_POST['imagen_url'] ?? '';

// Verifica que llegan
file_put_contents("debug_post.txt", print_r($_POST, true));  

$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

// Inserta
$sql = "INSERT INTO articulos (clave, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssds", $clave, $descripcion, $precio, $imagen_url);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Artículo agregado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();

?>
