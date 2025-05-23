<?php
session_start();
if ($_SESSION["rol"] !== "admin") {
    header("Location: operaciones.php");
    exit();
}
?>
