import mysql.connector
import json

def jsonResponse(status, message, result, cursor):
    data = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
    return json.dumps({
        "status": status,
        "message": message,
        "data": data
    }) 

def stringResponse(status, message):
    return json.dumps({
        "status": status,
        "message": message
    })

def get_connection():
    db_host = "localhost"
    db_user = "dbuser"
    db = "tilavaraus"
    db_password = "P!yMvo]41)5pog3y"

    conn = mysql.connector.connect(
        host = db_host,
        user = db_user,
        password = db_password,
        database = db
    )
    
    cur = conn.cursor()
    return conn, cur
