import connection
import urllib.parse

conn, cur = connection.get_connection()

# Definitions of CRUD functions
def create (data):
    print(f"Request data: {data}")
    sql = "INSERT INTO tilat VALUES(NULL, %s)"
    cur.execute(sql, (data.get("nimi"),))
    return connection.stringResponse("OK", "Uusi tila luotu onnistuneesti")

def get (self):
    #/api/tilat or /api/tilat/
    if self.path.split("tilat")[1] in ("", "/"):
        sql = "SELECT * FROM tilat"
        cur.execute(sql)
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/tilat/{ID}
    elif self.path.split("tilat/")[1].isnumeric():
        id = self.path.split("tilat/")[1]
        sql = "SELECT * FROM tilat WHERE id = %s"
        cur.execute(sql, (id,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
    #/api/tilat/{NAME}
    else:
        name = urllib.parse.unquote(self.path.split("tilat/")[1])
        sql ="SELECT * FROM tilat WHERE nimi = %s"
        cur.execute(sql, (name,))
        rSQL = cur.fetchall()
        return connection.jsonResponse("OK", "", rSQL, cur)
    
def delete (self):
    #/api/tilat or /api/tilat/
    if self.path.split("tilat")[1] in ("", "/"):
        return connection.stringResponse("Warning", "Monen tilan poistamista ei tueta")
    
    #/api/tilat/{ID}
    elif self.path.split("tilat/")[1].isnumeric():
        id = self.path.split("tilat/")[1]
        sql = "DELETE FROM tilat WHERE id = %s"
        cur.execute(sql, (id,))
        return connection.stringResponse("OK", "Tila (id="+id+") poistettu onnistuneesti")
    
    #/api/tilat/{NAME}
    else:
        name = urllib.parse.unquote(self.path.split("tilat/")[1])
        sql ="DELETE FROM tilat WHERE nimi = %s"
        cur.execute(sql, (name,))
        return connection.stringResponse("OK", "Tila (nimi="+name+") poistettu onnistuneesti")