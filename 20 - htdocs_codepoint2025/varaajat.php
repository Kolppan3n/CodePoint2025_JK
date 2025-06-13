<?php
include 'yhteys.php';

$sql_lause =  "SELECT * FROM varaajat";
try {
    $kysely = $yhteys->prepare($sql_lause);
    $kysely->execute();
} catch (PDOException $e) {
    die("VIRHE: " . $e->getMessage());
}
$tulos = $kysely->fetchAll();
?>

<!DOCTYPE html>
<html>

<head>
    <title>games</title>
    <meta charset="utf-8" />
</head>

<body>
    <header>
        <table>
            <tr>
                <th><a style="text-decoration: none;" href="tilat.php">Tilat</a></th>
                <th><a href="varaajat.php">Varaajat</a></th>
                <th><a style="text-decoration: none;" href="varaukset.php">Varaukset</a></th>
            </tr>
        </table>
    </header>
    <main>
        <table id="table-tilat">
            <form action="formHandler.php" method="POST">
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    <th>Poista</th>
                </tr>
                <?php
                foreach ($tulos as $varaaja) {
                    echo "<tr>
                        <td>" . $varaaja["id"] . "</td>
                        <td>" . $varaaja["nimi"] . "</td>
                        <td><button type='submit' name='varaaja_id' id=" . $varaaja["id"] . " value=" . $varaaja["id"] . ">X</button></td>
                        <input type='hidden' name='toiminto' value='poista_varaaja'>
                    </tr>";
                }
                ?>
            </form>
        </table>
        <form action="formHandler.php" method="POST">
            <h3>Rekisteröi uusi varaaja</h3>
            <label for="nimi">Varaajan nimi: </label>
            <input type="text" id="varaaja_nimi" name="varaaja_nimi" require>
            <input type="submit">
            <input type="hidden" name="toiminto" value="luo_varaaja">
        </form>
    </main>
    <footer></footer>
</body>

</html>