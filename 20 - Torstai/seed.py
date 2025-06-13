import sqlite3 
from tabulate import tabulate 

conn = sqlite3.connect('tilavaraus.db') 
cursor = conn.cursor() 

cursor.execute('''SELECT * FROM tilat;''') 
rows = cursor.fetchall()
if rows == []: 
    cursor.execute('''INSERT INTO tilat VALUES(NULL, 'neukkari_majakka');''')
    cursor.execute('''INSERT INTO tilat VALUES(NULL, 'neukkari_voltti');''')
    cursor.execute('''INSERT INTO tilat VALUES(NULL, 'toimisto_254');''')
    cursor.execute('''INSERT INTO tilat VALUES(NULL, 'toimisto_255');''')
    cursor.execute('''INSERT INTO tilat VALUES(NULL, 'toimisto_256');''')

cursor.execute('''SELECT * FROM varaajat;''') 
rows = cursor.fetchall()
if rows == []: 
    cursor.execute('''INSERT INTO varaajat VALUES(NULL, 'Väino Lammi');''')
    cursor.execute('''INSERT INTO varaajat VALUES(NULL, 'Liisa Ritola');''')
    cursor.execute('''INSERT INTO varaajat VALUES(NULL, 'Topias Vähälä');''')
    cursor.execute('''INSERT INTO varaajat VALUES(NULL, 'Ilari Tulkki');''')
    cursor.execute('''INSERT INTO varaajat VALUES(NULL, 'Kauno Koskinen');''')

cursor.execute('''SELECT * FROM varaukset;''') 
rows = cursor.fetchall()
if rows == []: 
    cursor.execute('''INSERT INTO varaukset VALUES(NULL, 1, 1, '2025-05-01 10:00:00');''')
    cursor.execute('''INSERT INTO varaukset VALUES(NULL, 1, 3, '2025-05-06 09:00:00');''')
    cursor.execute('''INSERT INTO varaukset VALUES(NULL, 5, 1, '2025-05-31 20:00:00');''')

cursor.execute('''SELECT * FROM tilat;''') 
rows = cursor.fetchall()
if rows: 
    print(tabulate(rows, headers=["ID", "Tila"], tablefmt="grid")) 
else: 
    print("No rows in tilat-table.") 

cursor.execute('''SELECT * FROM varaajat;''') 
rows = cursor.fetchall()
if rows: 
    print(tabulate(rows, headers=["ID", "Varaaja"], tablefmt="grid")) 
else: 
    print("No rows in tilat-table.") 
    
cursor.execute('''SELECT * FROM varaukset;''') 
rows = cursor.fetchall()
if rows: 
    print(tabulate(rows, headers=["ID", "Tila", "Varaaja", "Varauspaiva"], tablefmt="grid")) 
else: 
    print("No rows in tilat-table.") 
    
input("Commit chages? (y/n): ")
if "y":
    conn.commit()