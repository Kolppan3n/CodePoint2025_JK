import connection
import json
import urllib.parse

conn, cur = connection.get_connection()

# Definitions of CRUD functions
def create (data):
    print(f"Request data: {data}")
    sql = "INSERT INTO varaukset VALUES(NULL, %s, %s, %s)"
    values = (data["tila"], data["varaaja"], data["varauspaiva"])
    cur.execute(sql, values)
    return connection.stringResponse("OK", "Uusi varaus luotu onnistuneesti")

def get (self):
    #/api/varaukset or /api/varaukset/
    if self.path.split("varaukset")[1] in ("", "/"):
        sql = "SELECT id, tilat_id, varaajat_id, DATE_FORMAT(varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset"
        sqlFancy = '''SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, DATE_FORMAT(varaukset.varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset 
                INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id'''
        cur.execute(sqlFancy)
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/varaukset/{ID}
    elif self.path.split("varaukset/")[1].isnumeric():
        id = self.path.split("varaukset/")[1]
        sql = "SELECT id, tilat_id, varaajat_id, DATE_FORMAT(varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset WHERE id = %s"
        sqlFancy = '''SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, DATE_FORMAT(varaukset.varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset WHERE id = %s
                INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id'''
        cur.execute(sql, (id,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/varaukset/{DATE}
    else:
        date = urllib.parse.unquote(self.path.split("varaukset/")[1])
        sql ="SELECT id, tilat_id, varaajat_id, DATE_FORMAT(varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset WHERE varauspaiva = %s"
        sqlFancy = '''SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, DATE_FORMAT(varaukset.varauspaiva, '%Y-%m-%d') as varauspaiva FROM varaukset WHERE varauspaiva = %s
                INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id'''
        cur.execute(sql, (date,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
def delete (self):
    #/api/varaukset or /api/varaukset/
    if self.path.split("varaukset")[1] in ("", "/"):
        return connection.stringResponse("Warning", "Monen varauksen poistamista ei tueta")
    
    #/api/varaukset/{ID}
    if self.path.split("varaukset/")[1].isnumeric():
        id = self.path.split("varaukset/")[1]
        sql = "DELETE FROM varaukset WHERE id = %s"
        cur.execute(sql, (id,))
        return connection.stringResponse("OK", "Varaus (id="+id+") poistettu onnistuneesti")