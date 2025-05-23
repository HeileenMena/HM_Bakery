<?php
session_start();
if (!isset($_SESSION["rol"])) {
    header("Location: ../operaciones.html");  // Redirige a operaciones.html si no hay sesión
    exit();
}

$rol = $_SESSION["rol"];

// Redirigir a operaciones.html si el rol no es admin y el usuario intenta acceder a configuraciones
if ($rol !== "admin" && basename($_SERVER['PHP_SELF']) == 'configuracion.php') {
    header("Location: ../operaciones.html");  // Si el usuario no es admin, redirige a operaciones.html
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Punto de Venta - La Inventada</title>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../style.css"> 
    <link rel="../manifest" href="manifest.json">
</head>
<body>

<!-- Navbar principal -->
<div id="navbar"></div>

<div class="navbar">
    <a href="../operaciones.html">Operaciones</a>
    <a href="../consultas.html">Consultas</a>
    <!-- Esto solo será visible si el rol es admin -->
    <a href="../configuracion.html" id="configLink">Configuración</a>
</div>

<!-- Botones principales (ejemplo) -->
<div class="container">
    <div class="titulo">Operaciones</div>
    <div class="botones-op">
        <a href="ventas.html" class="opcion">Ver Ventas</a>
    </div>
</div>

</body>
</html>
