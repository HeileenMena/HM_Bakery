<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
file_put_contents(__DIR__ . "/debug_venta.txt", print_r($_POST, true));


$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión"]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario_id = $_POST['usuario_id'] ?? '';
    $total = $_POST['total'] ?? '';

    if (empty($usuario_id) || empty($total)) {
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
        exit;
    }

    $sql = "INSERT INTO ventas (usuario_id, total) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("id", $usuario_id, $total);
    $stmt->execute();
    
    echo json_encode([
        "success" => $stmt->affected_rows > 0,
        "message" => $stmt->affected_rows > 0 ? "Venta registrada correctamente" : "No se insertó ninguna venta",
        "venta_id" => $stmt->insert_id,
        "affected_rows" => $stmt->affected_rows
    ]); 

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "message" => "Método incorrecto"]);
}
?>
