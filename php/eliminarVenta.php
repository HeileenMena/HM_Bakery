<?php
header('Content-Type: application/json');

$venta_id = isset($_GET['venta_id']) ? intval($_GET['venta_id']) : 0;

if ($venta_id === 0) {
    echo json_encode(["success" => false, "message" => "ID de venta no válido"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

// Comenzamos la transacción
$conn->begin_transaction();

try {
    // Eliminar los detalles de la venta primero
    $stmt = $conn->prepare("DELETE FROM detalle_venta WHERE venta_id = ?");
    $stmt->bind_param("i", $venta_id);
    $stmt->execute();

    // Luego eliminamos la venta
    $stmt = $conn->prepare("DELETE FROM ventas WHERE id = ?");
    $stmt->bind_param("i", $venta_id);
    $stmt->execute();

    // Si todo va bien, confirmamos la transacción
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Venta y detalles eliminados con éxito"]);
} catch (Exception $e) {
    // Si ocurre un error, hacemos un rollback
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error al eliminar la venta: " . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
