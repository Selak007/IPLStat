import mysql.connector
import pandas as pd

# Connect to MySQL
connection = mysql.connector.connect(
    host="localhost",         # e.g. "localhost" or "127.0.0.1" or "db.yourhost.com"
    user="root",     # e.g. "root"
    password="Sharpeyecoder373!", # your MySQL password
    database="ipl"  # e.g. "ipl_stats"
)

cursor = connection.cursor()

create_table_query = """
CREATE TABLE IF NOT EXISTS matchups (
    batter VARCHAR(100),
    bowler VARCHAR(100),
    balls_faced INT,
    runs_scored INT,
    times_out INT,
    fours INT,
    sixes INT,
    strike_rate FLOAT,
    dismissal_rate FLOAT
);

"""
cursor.execute(create_table_query)

# Load CSV from Colab
df = pd.read_csv('matchups.csv')

for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO matchups (
            batter, bowler, balls_faced, runs_scored, times_out, 
            fours, sixes, strike_rate, dismissal_rate
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row['batter'], row['bowler'], row['Balls_Faced'], row['Runs_Scored'], row['Times_Out'],
        row['Fours'], row['Sixes'], row['Strike_Rate'], row['Dismissal_Rate']
    ))

connection.commit()
print("Data inserted into MySQL successfully.")
