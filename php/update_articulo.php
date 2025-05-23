<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "PATCH") {
    parse_str(file_get_contents("php://input"), $data);

    $clave = $data["clave"] ?? null;
    if (!isset($data['clave']) || empty(trim($data['clave']))) {
        echo json_encode(['success' => false, 'message' => 'Clave es obligatoria para actualizar']);
        exit;
    }

    // Construimos SQL dinámicamente
    $campos = [];
    $valores = [];

    if (isset($data["descripcion"])) {
        $campos[] = "descripcion = ?";
        $valores[] = $data["descripcion"];
    }
    if (isset($data["precio"])) {
        $campos[] = "precio = ?";
        $valores[] = $data["precio"];
    }
    if (isset($data["imagen_url"])) {
        $campos[] = "imagen_url = ?";
        $valores[] = $data["imagen_url"];
    }

    if (empty($campos)) {
        echo json_encode(["success" => false, "message" => "No hay campos para actualizar"]);
        exit;
    }

    $sql = "UPDATE articulos SET " . implode(", ", $campos) . " WHERE clave = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta"]);
        exit;
    }

    // Agregamos la clave al final
    $valores[] = $clave;

    // Construimos dinámicamente el tipo de datos para bind_param
    $tipos = "";
    foreach ($valores as $valor) {
        $tipos .= is_numeric($valor) ? "d" : "s";
    }

    $stmt->bind_param($tipos, ...$valores);
    $stmt->execute();

    echo json_encode([
        "success" => $stmt->affected_rows > 0,
        "message" => $stmt->affected_rows > 0 ? "Artículo actualizado" : "No se realizaron cambios"
    ]);

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido, usa PATCH"]);
}
