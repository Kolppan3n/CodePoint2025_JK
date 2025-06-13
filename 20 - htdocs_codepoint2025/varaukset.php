<?php
include 'yhteys.php';

$sql_varakset =  "SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, varaukset.varauspaiva FROM varaukset 
                INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id";
$sql_tilat =  "SELECT * FROM tilat";
$sql_varaajat =  "SELECT * FROM varaajat";
try {
    $kysely_varaukset = $yhteys->prepare($sql_varakset);
    $kysely_varaukset->execute();
    $kysely_tilat = $yhteys->prepare($sql_tilat);
    $kysely_tilat->execute();
    $kysely_varaajat = $yhteys->prepare($sql_varaajat);
    $kysely_varaajat->execute();
} catch (PDOException $e) {
    die("VIRHE: " . $e->getMessage());
}
$tulos_varaukset = $kysely_varaukset->fetchAll();
$tulos_tilat = $kysely_tilat->fetchAll();
$tulos_varaajat = $kysely_varaajat->fetchAll();
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
                <th><a style="text-decoration: none;" href="varaajat.php">Varaajat</a></th>
                <th><a href="varaukset.php">Varaukset</a></th>
            </tr>
        </table>
    </header>
    <main>
        <table id="table-tilat">
            <form action="formHandler.php" method="POST">
                <tr>
                    <th>ID</th>
                    <th>Tila</th>
                    <th>Varaaja</th>
                    <th>Päivämäärä</th>
                </tr>
                <?php
                foreach ($tulos_varaukset as $varaus) {
                    echo "<tr>
                        <td>" . $varaus["id"] . "</td>
                        <td>" . $varaus["tila"] . "</td>
                        <td>" . $varaus["varaaja"] . "</td>
                        <td>" . $varaus["varauspaiva"] . "</td>
                        <td><button type='submit' name='varaus_id' id=" . $varaus["id"] . " value=" . $varaus["id"] . ">X</button></td>
                        <input type='hidden' name='toiminto' value='poista_varaus'>
                    </tr>";
                }
                ?>
            </form>
        </table>
        <form action="formHandler.php" method="POST">
            <h3>Rekisteröi uusi varaus</h3>
            <label for="varaaja">Tilan nimi: </label>
            <select required id="tila" name="tila">
                <option value="" disabled selected hidden></option>
                <?php
                foreach ($tulos_tilat as $tila) {
                    echo "<option value=" . $tila["id"] . ">" . $tila["nimi"] . "</option>";
                }
                ?>
            </select>
            <label for="varaaja">Varaajan nimi: </label>
            <select required id="varaaja" name="varaaja">
                <option value="" disabled selected hidden></option>
                <?php
                foreach ($tulos_varaajat as $varaaja) {
                    echo "<option value=" . $varaaja["id"] . ">" . $varaaja["nimi"] . "</option>";
                }
                ?>
            </select>
            <label for="pvm">Päivämäärä: </label>
            <input type="date" id="pvm" name="pvm">
            <input type="submit">
            <input type="hidden" name="toiminto" value="luo_varaus">
        </form>
    </main>
    <footer></footer>
</body>

</html>