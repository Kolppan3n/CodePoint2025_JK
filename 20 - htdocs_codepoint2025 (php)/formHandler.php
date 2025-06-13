<?php

include 'yhteys.php';

if ($_SERVER["REQUEST_METHOD"]) {

    $toiminto = htmlspecialchars($_POST["toiminto"]);

    switch ($toiminto) {
        case "luo_tila":
            $nimi = htmlspecialchars($_POST["tila_nimi"]);
            $sql_lause =  'INSERT INTO tilat (nimi) VALUES (:nimi)';

            if (empty($nimi)) {
                break;
            }

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['nimi' => $nimi]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: tilat.php");
            break;
        case "poista_tila":
            $id = htmlspecialchars($_POST["tila_id"]);
            $sql_lause =  'DELETE FROM tilat WHERE ID = :id';

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['id' => $id]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: tilat.php");
            break;
        case "luo_varaaja":
            $nimi = htmlspecialchars($_POST["varaaja_nimi"]);
            $sql_lause =  'INSERT INTO varaajat (nimi) VALUES (:nimi)';

            if (empty($nimi)) {
                break;
            }

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['nimi' => $nimi]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: varaajat.php");
            break;
        case "poista_varaaja":
            $id = htmlspecialchars($_POST["varaaja_id"]);
            $sql_lause =  'DELETE FROM varaajat WHERE ID = :id';

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['id' => $id]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: varaajat.php");
            break;
        case "luo_varaus":
            $tila = htmlspecialchars($_POST["tila"]);
            $varaaja = htmlspecialchars($_POST["varaaja"]);
            $pvm = htmlspecialchars($_POST["pvm"]);

            $sql_lause =  'INSERT INTO varaukset (tilat_id, varaajat_id, varauspaiva) VALUES (:tila, :varaaja, :pvm)';

            if (empty($tila) or empty($varaaja) or empty($pvm)) {
                break;
            }

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['tila' => $tila, 'varaaja' => $varaaja, 'pvm' => $pvm]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: varaukset.php");
            break;
        case "poista_varaus":
            $id = htmlspecialchars($_POST["varaus_id"]);
            $sql_lause =  'DELETE FROM varaukset WHERE ID = :id';

            try {
                $kysely = $yhteys->prepare($sql_lause);
                $kysely->execute(['id' => $id]);
            } catch (PDOException $e) {
                die("VIRHE: " . $e->getMessage());
            }
            header("Location: varaukset.php");
            break;
        default:
            break;
    }
}

echo "Olet eksyksissä";
