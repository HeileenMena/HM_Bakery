<?php
$mysqli = new mysqli("localhost", "root", "", "hm_bakery");

if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$usuario = $_POST['usuario'];
$rol = $_POST['rol'];
$activo = isset($_POST['activo']) ? 1 : 0;

// Verificar si otro usuario tiene ese mismo nombre de usuario
$verifica = $mysqli->prepare("SELECT id FROM usuarios WHERE usuario = ? AND id != ?");
$verifica->bind_param("si", $usuario, $id);
$verifica->execute();
$verifica->store_result();

if ($verifica->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Ese nombre de usuario ya está registrado por otro usuario.']);
    exit;
}

$stmt = $mysqli->prepare("UPDATE usuarios SET nombre = ?, usuario = ?, rol = ?, activo = ? WHERE id = ?");
$stmt->bind_param("sssii", $nombre, $usuario, $rol, $activo, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el usuario.']);
}

$stmt->close();
$mysqli->close();
?>
