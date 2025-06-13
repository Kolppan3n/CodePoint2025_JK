from http.server import HTTPServer, BaseHTTPRequestHandler
import os
from random import randint
import json
import varaajat
import tilat
import varaukset
import connection

sessions = {}
conn, cur = connection.get_connection()

class SessionHandler(BaseHTTPRequestHandler):
        
    def generate_sid(self):
        return "".join(str(randint(1,9)) for _ in range(100))
    
    def parse_cookies(self, cookie_list):
        return dict(((c.split("=")) for c in cookie_list.split(";"))) \
        if cookie_list else {}
        
    def validate_session(self):
        self.cookie = None
        try:
            cookies = self.parse_cookies(self.headers["Cookie"])
            if "sid" in cookies:
                print("Found correctly formated cookies")
                if cookies["sid"] in sessions:
                    print("The user is logged in")
                    self.user = cookies["sid"]
                else:
                    print("Cookie doesnt have a session, Failure")
                    self.user = False
            else:
                self.user = False
                print("Cookies are missing the correct key")
        except Exception as e:
            self.user = False
            print(f"Unable to parse cookies. Error: {e}")
    
    def login(self, login_data):
        try:
            sql = "SELECT nimi FROM kayttajat WHERE tunnus = %s AND salasana = %s"
            values = (login_data["tunnus"], login_data["salasana"])
            cur.execute(sql, values)
            response = cur.fetchall()
            print("sql responded with: " + json.dumps(response))
            if response:
                sid = self.generate_sid()
                self.cookie = "sid={}".format(sid)
                sessions[sid] = {"username", "useragent", "ip address", "expiry"}
                print("User Found. Login Successful!")
                return True
            else:
                print("Wrong user or password. Login Failed!")
                return False
        except Exception as e:
            print(f"Error in query. Error: {e}")
            return False
    
    def jsonResponse(self, result, cursor):
        data = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        return json.dumps({
            "status": "OK",
            "result": data
        }) 

    def stringResponse(self, status, message):
        return json.dumps({
            "status": status,
            "message": message
        })
    
    # Sallitaan CORS
    def cors_headers(self):
        origin = self.headers.get('Origin')
        self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Cookie")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        
    def do_OPTIONS(self):
        self.validate_session()
        self.send_response(200)
        self.cors_headers()
        self.end_headers()
    
    def do_POST(self):
        
        self.validate_session()
        
        # Sessio kirjautuminen
        if self.path == "/api/login" and self.user is False:
            try:
                login_data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                session = self.login(login_data)
                print("session: " + str(session))
                if session:
                    print("Login Success")
                    self.send_response(200)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    if self.cookie:
                        self.send_header('Set-Cookie', self.cookie)
                    self.end_headers()
                    self.wfile.write(bytes(self.stringResponse("200", "Login Successful"), 'utf-8'))
                else:
                    print("Login Failed")
                    self.send_response(401)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(bytes(self.stringResponse("401", "Login Failed"), 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = self.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Varaajan luominen
        elif self.path == "/api/varaajat" and self.user:
            try:
                content_length = int(self.headers['Content-Length'])
                post_data_bytes = self.rfile.read(content_length)
                post_data_json = json.loads(post_data_bytes)
                response_data = varaajat.create(post_data_json)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaajat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Tilan luominen
        elif self.path == "/api/tilat" and self.user:
            try:
                content_length = int(self.headers['Content-Length'])
                post_data_bytes = self.rfile.read(content_length)
                post_data_json = json.loads(post_data_bytes)
                response_data = tilat.create(post_data_json)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = tilat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Varauksen luominen
        elif self.path == "/api/varaukset" and self.user:
            try:
                content_length = int(self.headers['Content-Length'])
                post_data_bytes = self.rfile.read(content_length)
                post_data_json = json.loads(post_data_bytes)
                response_data = varaukset.create(post_data_json)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaukset.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = self.stringResponse("404", "Not Found")
            self.wfile.write(bytes(response_data, 'utf-8'))
            
                
    def do_GET(self):
        
        self.validate_session()
        
        # Ohjaus aloitukseen
        if self.path == '/' or self.path == '/api' or self.path == '/api/':
            self.path = '/api/index'
            self.send_response(302)
            self.cors_headers()
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Location', '/api/index')
        
        # Aloitus eli Index
        if self.path == '/api/index':
            try:
                file_to_open = open("index.html").read()
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(bytes(file_to_open, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaukset.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
        
        #Uloskirjautuminen
        elif self.path == '/api/logout':
            try:
                if self.user:
                    self.cookie = "sid="
                    del sessions[self.user]
                    self.send_response(200)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response_data = self.stringResponse("200", "Logged out successfully")
                    self.wfile.write(bytes(response_data, 'utf-8'))
                else:
                    self.send_response(404)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response_data = self.stringResponse("404", "You are not logged in")
                    self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = self.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
        
        # Varaajien hakeminen
        elif self.path.startswith("/api/varaajat"):
            try:
                response_data = varaajat.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaajat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Tilojen hakeminen
        elif self.path.startswith("/api/tilat"):
            try:
                response_data = tilat.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = tilat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Varausten hakeminen
        elif self.path.startswith("/api/varaukset"):
            try:
                response_data = varaukset.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaukset.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = varaajat.stringResponse("404", "Not Found")
            self.wfile.write(bytes(response_data, 'utf-8'))
            
    def do_DELETE(self):
        
        self.validate_session()
        
        # Varaajien poistaminen
        if self.path.startswith("/api/varaajat") and self.user:
            try:
                response_data = varaajat.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaajat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Tilojen poistaminen
        elif self.path.startswith("/api/tilat") and self.user:
            try:
                response_data = tilat.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = tilat.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Varausten poistaminen
        elif self.path.startswith("/api/varaukset") and self.user:
            try:
                response_data = varaukset.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response_data, 'utf-8'))
            except Exception as e:
                print(e)
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = varaukset.stringResponse("404", str(e))
                self.wfile.write(bytes(response_data, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = varaajat.stringResponse("404", "Not Found")
            self.wfile.write(bytes(response_data, 'utf-8'))

os.system('cls' if os.name == 'nt' else 'clear')
print("Starting server...")
server = HTTPServer(('localhost', 8000), SessionHandler)
print("Hosting server on port: 8000")
server.serve_forever()