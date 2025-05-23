<?php
// Archivo PHP para crear un nuevo usuario

// Conexión a la base de datos
$servername = "localhost";
$username = "root";  // Ajusta estos valores según tu configuración
$password = "";
$dbname = "hm_bakery"; // Cambia esto por el nombre de tu base de datos

// Conexión a MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error]);
    exit();
}

// Obtener los datos del formulario
$nombre = $_POST['nombre'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];  // Ya no usamos password_hash(), se guarda tal cual
$rol = $_POST['rol'];
$activo = isset($_POST['activo']) ? 1 : 0; // Si el checkbox está marcado, 'activo' será 1; de lo contrario, será 0

// Verificar si el nombre de usuario ya está registrado
$sql_check = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Si el usuario ya existe, mostrar un mensaje de error
    echo json_encode(['success' => false, 'message' => 'El nombre de usuario ya está registrado.']);
    exit();
}

// Insertar el nuevo usuario en la base de datos
$sql = "INSERT INTO usuarios (nombre, usuario, password, rol, activo) 
        VALUES ('$nombre', '$usuario', '$password', '$rol', '$activo')";

// Ejecutar la consulta y verificar si fue exitosa
if ($conn->query($sql) === TRUE) {
    header("Location: http://localhost/HM_Bakery/configuracion.html");
    exit(); // Detener el script después de la redirección
} else {
    echo json_encode(['success' => false, 'message' => 'Error al crear el usuario: ' . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>
