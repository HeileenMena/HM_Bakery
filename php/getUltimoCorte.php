<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

// Ejecutar la consulta SQL para obtener el último corte
$sql = "SELECT * FROM cortes_caja ORDER BY fecha DESC LIMIT 1"; // Obtener el último corte
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    // Si se encuentra un corte, devolver la información
    echo json_encode([
        "success" => true,
        "id" => $row['id'],
        "usuario_id" => $row['usuario_id'],
        "fecha" => $row['fecha'],
        "caja" => $row['caja'],
        "total" => $row['total']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al obtener el último corte."]);
}

// Cerrar conexión
$conn->close();
?>
