<?php
include 'yhteys.php';

$sql_lause =  "SELECT * FROM tilat";
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
                <th><a href="tilat.php">Tilat</a></th>
                <th><a style="text-decoration: none;" href="varaajat.php">Varaajat</a></th>
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
                foreach ($tulos as $tila) {
                    echo "<tr>
                        <td>" . $tila["id"] . "</td>
                        <td>" . $tila["nimi"] . "</td>
                        <td><button type='submit' name='tila_id' id=" . $tila["id"] . " value=" . $tila["id"] . ">X</button></td>
                        <input type='hidden' name='toiminto' value='poista_tila'>
                    </tr>";
                }
                ?>
            </form>
        </table>
        <form action="formHandler.php" method="POST">
            <h3>Rekisteröi uusi tila</h3>
            <label for="nimi">Tilan nimi: </label>
            <input type="text" id="tila_nimi" name="tila_nimi" require>
            <input type="submit">
            <input type="hidden" name="toiminto" value="luo_tila">
        </form>
    </main>
    <footer></footer>
</body>

</html>