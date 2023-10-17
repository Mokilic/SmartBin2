import sqlite3
from datetime import datetime
import pytz

def dato():
    tz = pytz.timezone('Europe/Oslo')
    timestamp = datetime.now(tz)
    # timestamp = now.strftime("%H:%M-%d/%m/%Y")
    return timestamp


dbname = "data.db"
#table_name = input("Enter table name: ")

def create_table(table_name):
    conn = sqlite3.connect(dbname)
    curs = conn.cursor()
    curs.execute(f'CREATE TABLE IF NOT EXISTS {table_name} (id INTEGER PRIMARY KEY, timestamp DATETIME, percentage REAL)')
    curs.execute(f'INSERT INTO {table_name} (ID, timestamp, percentage) VALUES(1, CURRENT_TIMESTAMP, 0)')

    conn.commit()
    conn.close()



def logdata(table_name, a, b):
    conn = sqlite3.connect(dbname) 
    curs = conn.cursor() 
    curs.execute(f'INSERT INTO {table_name} (timestamp, percentage) VALUES (?, ?)', (a, b))

    conn.commit()
    conn.close()
