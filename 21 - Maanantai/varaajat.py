import connection
import json
import urllib.parse

conn, cur = connection.get_connection()

# Definitions of CRUD functions
def create (data):
    print(f"Request data: {data}")
    sql = "INSERT INTO varaajat VALUES(NULL, %s)"
    cur.execute(sql, (data.get("nimi"),))
    return connection.stringResponse("OK", "Uusi varaaja luotu onnistuneesti")

def get (self):
    #/api/varaajat or /api/varaajat/
    if self.path.split("varaajat")[1] in ("", "/"):
        sql = "SELECT * FROM varaajat"
        cur.execute(sql)
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/varaajat/{ID}
    elif self.path.split("varaajat/")[1].isnumeric():
        id = self.path.split("varaajat/")[1]
        sql = "SELECT * FROM varaajat WHERE id = %s"
        cur.execute(sql, (id,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/varaajat/{NAME}
    else:
        name = urllib.parse.unquote(self.path.split("varaajat/")[1])
        sql ="SELECT * FROM varaajat WHERE nimi = %s"
        cur.execute(sql, (name,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
def delete (self):
    #/api/varaajat or /api/varaajat/
    if self.path.split("varaajat")[1] in ("", "/"):
        return connection.stringResponse("Warning", "Monen varaajan poistamista ei tueta")
    
    #/api/varaajat/{ID}
    elif self.path.split("varaajat/")[1].isnumeric():
        id = self.path.split("varaajat/")[1]
        sql = "DELETE FROM varaajat WHERE id = %s"
        cur.execute(sql, (id,))
        return connection.stringResponse("OK", "Varaaja (id="+id+") poistettu onnistuneesti")
    
    #/api/varaajat/{NAME}
    else:
        name = urllib.parse.unquote(self.path.split("varaajat/")[1])
        sql = "DELETE FROM varaajat WHERE nimi = %s"
        cur.execute(sql, (name,))
        return connection.stringResponse("OK", "Varaaja (nimi="+name+") poistettu onnistuneesti")