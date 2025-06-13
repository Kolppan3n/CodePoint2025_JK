<?php
$host = "localhost";
$username = "dbuser";
$database = "tilavaraus";
$password = "P!yMvo]41)5pog3y";
try {
    $yhteys = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $yhteys->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "<p>" . $e->getMessage() . "<p>";
}
?>
