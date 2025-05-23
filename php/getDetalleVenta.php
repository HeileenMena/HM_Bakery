<?php
header('Content-Type: application/json');

// Obtener el ID de la venta desde la solicitud GET
$venta_id = isset($_GET['venta_id']) ? intval($_GET['venta_id']) : 0;

$conn = new mysqli("localhost", "root", "", "hm_bakery");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

// Consulta SQL para obtener los artículos de la venta
$query = "SELECT 
                a.clave AS articulo_clave, 
                a.descripcion AS articulo_descripcion,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
          FROM detalle_venta dv
          JOIN articulos a ON dv.articulo_id = a.id
          WHERE dv.venta_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $venta_id); // Vinculamos el parámetro venta_id
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $detalles = [];
    while ($row = $result->fetch_assoc()) {
        $detalles[] = $row;
    }
    echo json_encode(["success" => true, "detalles" => $detalles]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron detalles para esta venta."]);
}

$stmt->close();
$conn->close();
?>
