from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json
import varaajat
import tilat
import varaukset
import auth

class SessionHandler(BaseHTTPRequestHandler):
    
    # Sallitaan CORS
    def cors_headers(self):
        origin = self.headers.get('Origin')
        self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Expose-Headers', 'Authorization')
        
    def do_OPTIONS(self):
        self.send_response(200)
        self.cors_headers()
        self.end_headers()
    
    def do_POST(self):
        
        # Tokenin luominen
        if self.path == "/api/login":
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = json.loads(self.rfile.read(content_length))
                response = auth.create_token(post_data)
                print(f"Response: {response}")
                if response:
                    self.send_response(200)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(bytes(response, 'utf-8'))
                else:
                    self.send_response(401)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = json.dumps({"status": "404", "message": "Login failed"})
                    self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"POST({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Varaajan luominen
        elif self.path == "/api/varaajat" and auth.authenticate(self):
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = json.loads(self.rfile.read(content_length))
                response = varaajat.create(post_data)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"POST({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Tilan luominen
        elif self.path == "/api/tilat" and auth.authenticate(self):
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = json.loads(self.rfile.read(content_length))
                response = tilat.create(post_data)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"POST({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Varauksen luominen
        elif self.path == "/api/varaukset" and auth.authenticate(self):
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = json.loads(self.rfile.read(content_length))
                response = varaukset.create(post_data)
                self.send_response(201)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"POST({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = json.dumps({"message": "Not Found"})
            self.wfile.write(bytes(response, 'utf-8'))
            
                
    def do_GET(self):
        
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
                print(f"GET({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
        
        #Uloskirjautuminen
        elif self.path == '/api/logout' and auth.authenticate(self):
            try:
                token = auth.get_token(self)
                if auth.revoke_token(token):
                    self.send_response(200)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = json.dumps({"status": "404", "message": "Logout successful"})
                    self.wfile.write(bytes(response, 'utf-8'))
                else:
                    self.send_response(200)
                    self.cors_headers()
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = json.dumps({"status": "200", "message": "Logout not required"})
                    self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"GET({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
        
        # Varaajien hakeminen
        elif self.path.startswith("/api/varaajat"):
            try:
                response = varaajat.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"GET({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Tilojen hakeminen
        elif self.path.startswith("/api/tilat"):
            try:
                response = tilat.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"GET({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Varausten hakeminen
        elif self.path.startswith("/api/varaukset"):
            try:
                response = varaukset.get(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"GET({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = json.dumps({"status": "404", "message": "Not Found"})
            self.wfile.write(bytes(response, 'utf-8'))
            
    def do_DELETE(self):
        
        # Varaajien poistaminen
        if self.path.startswith("/api/varaajat") and auth.authenticate(self):
            try:
                response = varaajat.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"DELETE({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Tilojen poistaminen
        elif self.path.startswith("/api/tilat") and auth.authenticate(self):
            try:
                response = tilat.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"DELETE({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Varausten poistaminen
        elif self.path.startswith("/api/varaukset") and auth.authenticate(self):
            try:
                response = varaukset.delete(self)
                self.send_response(200)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(response, 'utf-8'))
            except Exception as e:
                print(f"DELETE({self.path}) Exeption: {e}")
                self.send_response(404)
                self.cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps({"status": "404", "message": str(e)})
                self.wfile.write(bytes(response, 'utf-8'))
                
        # Jos URL ei osu mihinkään
        else:
            self.send_response(404)
            self.cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = json.dumps({"status": "404", "message": "Not Found"})
            self.wfile.write(bytes(response, 'utf-8'))

os.system('cls' if os.name == 'nt' else 'clear')
print("Starting server...")
server = HTTPServer(('localhost', 8000), SessionHandler)
print("Hosting server on port: 8000")
print("File: api_tokened.py")
server.serve_forever()