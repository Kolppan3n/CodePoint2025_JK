import connection
import json
from datetime import datetime, timedelta, timezone
import jwt

conn, cur = connection.get_connection()

blacklist = set()
    
def sqlToJSON (data):
    return [dict(zip([key[0] for key in cur.description], row)) for row in data]
        
# Headers:  These are like the secret decoder rings of JWTs.
#           Headers reveal which algorithm was used to concoct the token. 
#           This info becomes invaluable when the server needs to verify the token’s authenticity later on.
    
# Payload:  Picture the payload as a treasure chest brimming with valuable loot. 
#           It’s where we stash all the user-specific data, like user IDs, roles, 
#           or any other tidbits you want to carry along with the token.

# Signature: Ah, the signature — it’s the digital seal of approval. 
#           To create it, we take the headers and payload, give them a whirl with a secret key, 
#           and voilà, we have a signature. This signature ensures the token hasn’t been tampered with, 
#           maintaining the trustworthiness of the JWT.

def authenticate(self):
    auth_header = self.headers.get("Authorization")
    print(f"Auth_Header: {auth_header}")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        if validate_token(token):
            if token not in blacklist:
                return True
            else:
                print("Found Revoked token")
                return False
        else:
            return False
    else:
        print("Malformed token")
        return False

def get_token(self):
    auth_header = self.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        return token
    else:
        return None

# Siivoaa vanhentuneet tokenit pois Blacklistasta ja lisää uuden tokenin
def revoke_token(token):
    if validate_token(token):
        for tkn in blacklist:
            if validate_token(tkn):
                blacklist.remove(tkn)
        blacklist.add(token)
        return "Token Revoked Successfully"
    else:
        return None
        
def validate_token(token):
    secret_key = "SessiotOnKoviksille666"
    algorithm = "HS256"
    try:
        decoded_payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        print(f"Token is valid. decoded_payload: {decoded_payload}")
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print("Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        print("Invalid token. Access denied.")
    return None
    
def create_token(login_data):
    try:
        sql = "SELECT id, nimi, rooli FROM kayttajat WHERE tunnus = %s AND salasana = %s"
        values = (login_data["tunnus"], login_data["salasana"])
        cur.execute(sql, values)
        print(f"values: {values}")
        rSQL = cur.fetchall()
        if rSQL:
            rJSON = sqlToJSON(rSQL)[0]
            print("User Found. Login Successful!")
            secret_key = "SessiotOnKoviksille666"
            algorithm = "HS256"
            payload = {
                "id": rJSON["id"],
                "name": rJSON["nimi"],
                "exp": datetime.now(timezone.utc) + timedelta(hours=1)
            }
            token = jwt.encode(payload, secret_key, algorithm=algorithm)
            return json.dumps({"status": "OK", "message": "Login Successful", "data": rJSON, "token": token})
        else:
            print("Wrong user or password. Login Failed!")
            return ""
    except Exception as e:
        print(f"Error in SQL or JWT. Error: {e}")
        return ""