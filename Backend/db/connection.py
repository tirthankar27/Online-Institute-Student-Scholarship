import psycopg2

def get_connection():
    return psycopg2.connect(
        dbname="scholarship",
        user="postgres",
        password="jalpaiguri@1",
        host="localhost",
        port="5432"
    )