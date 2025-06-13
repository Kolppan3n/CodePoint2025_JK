import sqlite3 
import os
from tabulate import tabulate 

conn = sqlite3.connect('tilavaraus.db') 
cursor = conn.cursor() 

def cls():
    os.system('cls' if os.name=='nt' else 'clear')

def varaukset():
    cls()
    
    sql = '''SELECT varaukset.id, tilat.nimi AS tila, varaajat.nimi AS varaaja, varaukset.varauspaiva FROM varaukset 
                INNER JOIN tilat ON varaukset.tilat_id = tilat.id
                INNER JOIN varaajat ON varaukset.varaajat_id = varaajat.id'''
    cursor.execute(sql) 
    rows = cursor.fetchall()
    if rows: 
        print("Varaukset-Taulu")
        print(tabulate(rows, headers=["ID", "Tila", "Varaaja", "Varauspaiva"], tablefmt="grid")) 
    else: 
        print("Varauksia ei löytynyt") 
    
    print("""
    1. Poista varaus
    2. Luo varaus
    0. Palaa aloitukseen
    """)
    toiminto = input("Valitse toiminto (1-2): ")
    
    if toiminto == "1":
        id = (int(input("Poistettavan varauksen ID: ")))
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "DELETE FROM varaukset WHERE id = ?"
            cursor.execute(sql, (id,))
        varaukset()
        
    elif toiminto == "2":
        tila_id = int(input("Varattavan tilan ID: "))
        varaaja_id = int(input("Varaajan ID: "))
        varauspaiva = input("Ajankohta (YYYY-MM-DD HH:MM:SS): ")
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "INSERT INTO varaukset VALUES (NULL, ?, ?, ?)"
            values = (tila_id, varaaja_id, varauspaiva)
            cursor.execute(sql, values)
        varaukset()
        
    elif toiminto == "0":
        aloitus()
        
    else:
        varaukset()

def varaajat():
    cls()
    
    cursor.execute('''SELECT * FROM varaajat;''') 
    rows = cursor.fetchall()
    if rows: 
        print("Varaajat-Taulu")
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("Käyttäjiä ei löytynyt") 
    
    print("""
    1. Poista käyttäjä
    2. Luo käyttäjä
    0. Palaa aloitukseen
    """)
    toiminto = input("Valitse toiminto (1-2): ")
    
    if toiminto == "1":
        id = (int(input("Poistettavan käyttäjä ID: ")))
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "DELETE FROM varaajat WHERE id = ?"
            cursor.execute(sql, (id,))
        varaajat()
        
    elif toiminto == "2":
        nimi = input("Uuden käyttäjän nimi (etunimi sukunimi): ")
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "INSERT INTO varaajat VALUES (NULL, ?)"
            cursor.execute(sql, (nimi,))
        varaajat()
        
    elif toiminto == "0":
        aloitus()
        
    else:
        varaajat()
    
def tilat():
    cls()
    
    cursor.execute('''SELECT * FROM tilat;''') 
    rows = cursor.fetchall()
    if rows: 
        print("Tilat-Taulu")
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("Varattavissa olevia tiloja ei löytynyt") 
    
    print("""
    1. Poista tila
    2. Luo tila
    0. Palaa aloitukseen
    """)
    toiminto = input("Valitse toiminto (1-2): ")
    
    if toiminto == "1":
        id = (int(input("Poistettavan tilan ID: ")))
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "DELETE FROM tilat WHERE id = ?"
            cursor.execute(sql, (id,))
        tilat()
        
    elif toiminto == "2":
        nimi = input("Uuden tilan nimi: ")
        varmistus = input("Oletko varma? (y/n): ")
        if varmistus == "y":
            sql = "INSERT INTO tilat VALUES (NULL, ?)"
            cursor.execute(sql, (nimi,))
        tilat()
        
    elif toiminto == "0":
        aloitus()
        
    else:
        varaajat()

def aloitus():
    cls()
    print("""Tervetuloa tilanvaraussovellukseen!

    1. Katso varauksia
    2. Katso varaajia
    3. Katso tiloja
    0. Lopeta

    """)

    osasto = input("Valitse toiminto (1-3): ")

    if osasto == "1":
        varaukset()
    
    elif osasto == "2":
        varaajat()
    
    elif osasto == "3":
        tilat()
        
    elif osasto == "0":
        return
    
    else:
        aloitus()
    
aloitus()