<?php
$mysqli = new mysqli("localhost", "root", "", "hm_bakery");

if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

$id = $_POST['id'];

// Verificar si el usuario es admin
$result = $mysqli->prepare("SELECT rol FROM usuarios WHERE id = ?");
$result->bind_param("i", $id);
$result->execute();
$result->bind_result($rol);
$result->fetch();
$result->close();

if ($rol === 'admin') {
    echo json_encode(['success' => false, 'message' => 'No se puede eliminar un usuario con rol admin.']);
    exit;
}

// Eliminar usuario
$stmt = $mysqli->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario.']);
}

$stmt->close();
$mysqli->close();
?>
