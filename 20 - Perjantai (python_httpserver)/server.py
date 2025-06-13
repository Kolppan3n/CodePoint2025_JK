from http.server import HTTPServer, BaseHTTPRequestHandler
import mysql.connector
from jinja2 import Environment, FileSystemLoader

db_host = "localhost"
db_user = "dbuser"
db = "tilavaraus"
db_password = "P!yMvo]41)5pog3y"

mydb = mysql.connector.connect(
    host = db_host,
    user = db_user,
    password = db_password,
    database = db
)
mycursor = mydb.cursor()

def objectify(result, cursor):
    return [dict(zip([key[0] for key in cursor.description], row)) for row in result]

# Haetaan varaukset #
mycursor.execute('''SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, varaukset.varauspaiva FROM varaukset 
                    INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                    INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id''')
result1 = mycursor.fetchall()
varaukset = objectify(result1, mycursor)

# Haetaan varaajat #
mycursor.execute("SELECT * FROM varaajat")
result2 = mycursor.fetchall()
varaajat = objectify(result2, mycursor)

# Haetaan tilat #
mycursor.execute("SELECT * FROM tilat")
result3 = mycursor.fetchall()
tilat = objectify(result3, mycursor)

# Jinjaan lähtevät argumentit #
context = {
    "otsikko": "Tilavaraus",
    "varaukset": varaukset,
    "varaajat": varaajat,
    "tilat": tilat
}

# Otetaan html template jossa on placehodereita ja context jossa on täytettävät tiedot
# Jinja luo uuden index.html jossa templaatti on pohjana ja placeholderit on täytetty context arvoilla
def createIndexFile():
    environment = Environment(loader=FileSystemLoader("templates/"))
    index_template = environment.get_template("index_template.html")
    index_filename = "templates/index.html"
        
    with open(index_filename, mode="w", encoding="utf-8") as index:
        index.write(index_template.render(context))
        print(f"... jinja rewrote index.html")
    
class myHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        createIndexFile()
        if self.path == '/':
            self.path = '/index.html'
        try:
            file_to_open = open("templates/" + self.path[1:]).read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
        except:
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'404 - Not Found')

server = HTTPServer(('localhost', 8000), myHandler)
server.serve_forever()