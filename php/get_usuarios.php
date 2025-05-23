<?php
$mysqli = new mysqli("localhost", "root", "", "hm_bakery");
if ($mysqli->connect_error) {
    die(json_encode([]));
}

$result = $mysqli->query("SELECT id, nombre, usuario, rol, activo FROM usuarios");

$usuarios = [];
while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode($usuarios);
$mysqli->close();
?>
