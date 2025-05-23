<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['usuario_id'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$usuario_id = intval($input['usuario_id']);
$caja = $input['caja'];
$total = floatval($input['total']);

$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

// Insertar el corte en `cortes_caja`
$stmt = $conn->prepare("INSERT INTO cortes_caja (usuario_id, caja, total) VALUES (?, ?, ?)");
$stmt->bind_param("isd", $usuario_id, $caja, $total);
$ok = $stmt->execute();

if ($ok) {
    // Obtener el ID del nuevo corte
    $corte_id = $conn->insert_id;

    // Actualizar ventas sin corte asignado
    $updateVentas = $conn->prepare("UPDATE ventas SET corte_id = ? WHERE usuario_id = ? AND corte_id IS NULL");
    $updateVentas->bind_param("ii", $corte_id, $usuario_id);
    $updateVentas->execute();

    echo json_encode(["success" => true, "message" => "Corte guardado y ventas actualizadas."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar."]);
}

// Cerrar conexiones
$stmt->close();
$updateVentas->close();
$conn->close();
?>
