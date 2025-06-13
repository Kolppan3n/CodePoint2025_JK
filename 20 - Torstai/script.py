import sqlite3 
from tabulate import tabulate 

conn = sqlite3.connect('tilavaraus.db') 
cursor = conn.cursor() 

conn.execute(
    '''CREATE TABLE IF NOT EXISTS tilat(
        id integer PRIMARY KEY AUTOINCREMENT,
        nimi text NOT NULL);''')

conn.execute(
    '''CREATE TABLE IF NOT EXISTS varaajat(
        id integer PRIMARY KEY AUTOINCREMENT,
        nimi text NOT NULL);''')

conn.execute(
    '''CREATE TABLE IF NOT EXISTS varaukset(
        id integer PRIMARY KEY AUTOINCREMENT,
        tilat_id integer,
        varaajat_id integer,
        varauspaiva date,
        FOREIGN KEY(tilat_id) REFERENCES tilat(id),
        FOREIGN KEY(varaajat_id) REFERENCES varaajat(id));''')

cursor.execute('''SELECT * FROM tilat;''') 
rows = cursor.fetchall() 
if rows: 
    print(tabulate(rows, headers=["ID", "Value"], tablefmt="grid")) 
else: 
    print("No rows in table.") 