<?php
session_start();
$conexion = new mysqli("localhost", "root", "", "hm_bakery");

if ($conexion->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión"]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST["usuario"];
    $password = $_POST["password"];

    $stmt = $conexion->prepare("SELECT id, nombre, password, rol FROM usuarios WHERE usuario = ? AND activo = 1");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if ($password === $row["password"]) {  // Comparación directa en texto plano
            $_SESSION["usuario"] = $row["usuario"];
            $_SESSION["nombre"] = $row["nombre"];
            $_SESSION["rol"] = $row["rol"];

            header("Location: http://localhost/HM_Bakery/php/operaciones.php");  // Redirige a operaciones.php
            exit();
        } else {
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado o inactivo"]);
    }

    $stmt->close();
    $conexion->close();
}
?>
