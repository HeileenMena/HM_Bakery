<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Asegurar que la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Capturar datos enviados
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Validar datos recibidos
if (!isset($data["venta_id"]) || !isset($data["articulos"]) || !is_array($data["articulos"])) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$venta_id = intval($data["venta_id"]);
$articulos = $data["articulos"];

// Preparar la consulta para insertar detalle_venta
$sql = "INSERT INTO detalle_venta (venta_id, articulo_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conexion->error]);
    exit;
}

// Procesar cada artículo
foreach ($articulos as $articulo) {
    if (!isset($articulo["articulo_id"], $articulo["cantidad"], $articulo["precio_unitario"], $articulo["importe"])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos para un artículo"]);
        exit;
    }

    $clave_articulo = $articulo["articulo_id"]; // Aquí se usa la clave como ID lógico
    $cantidad = intval($articulo["cantidad"]);
    $precio_unitario = floatval($articulo["precio_unitario"]);
    $subtotal = floatval($articulo["importe"]);

    // Buscar ID real a partir de la clave
    $check_stmt = $conexion->prepare("SELECT id FROM articulos WHERE clave = ?");
    $check_stmt->bind_param("s", $clave_articulo);
    $check_stmt->execute();
    $result = $check_stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "El artículo con clave '$clave_articulo' no existe"]);
        exit;
    }

    $articulo_data = $result->fetch_assoc();
    $articulo_id = intval($articulo_data["id"]);
    $check_stmt->close();

    // Insertar en detalle_venta
    $stmt->bind_param("iiidd", $venta_id, $articulo_id, $cantidad, $precio_unitario, $subtotal);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error al insertar detalle de venta: " . $stmt->error]);
        exit;
    }
}

echo json_encode(["success" => true, "message" => "Detalle de venta registrado correctamente"]);
exit;
?>
