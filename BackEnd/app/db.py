import pymysql
import os

def init_db(app):

    try:   

        conn = pymysql.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        
        app.db_connection = conn

        print("Banco de dados conectado com sucesso!")

    except Exception as e:
        
        print("Erro ao conectar ao banco de dados:", e)