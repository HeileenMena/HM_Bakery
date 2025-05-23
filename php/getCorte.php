<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

// Ejecutar la consulta SQL para obtener el monto total de ventas sin corte
$sql = "SELECT SUM(total) AS monto_total FROM ventas WHERE corte_id IS NULL";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    $monto_total = $row['monto_total'] ? $row['monto_total'] : 0; // Si es NULL, asignar 0
    echo json_encode(["success" => true, "monto_total" => $monto_total]);
} else {
    echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta."]);
}

// Cerrar conexión
$conn->close();
?>
