<?php
header('Content-Type: application/json');

// Establecer la conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

// Consulta para obtener ventas sin corte asignado
$query = "SELECT v.id, v.fecha, v.total, c.nombre AS vendedor FROM ventas v
          LEFT JOIN usuarios c ON v.usuario_id = c.id
          ORDER BY v.fecha DESC;";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $ventas = [];
    while ($row = $result->fetch_assoc()) {
        $ventas[] = $row;
    }
    echo json_encode(["success" => true, "ventas" => $ventas]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron ventas sin corte."]);
}

$conn->close();
?>
