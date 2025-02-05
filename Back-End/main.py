from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import psycopg2

# Carregar variáveis do arquivo .env
load_dotenv()

# Recuperar variáveis de ambiente
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")  # geralmente 5432
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Conexão com o banco de dados (psycopg2)
# Em produção, o ideal é tratar exceções e gerenciar conexão de forma robusta (pool, etc.)
conn = psycopg2.connect(
    host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
)

# Criar a tabela "users" caso não exista
with conn.cursor() as cursor:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE
        );
    """
    )
    conn.commit()

app = FastAPI()


# Modelo pydantic para registrar usuário
class RegisterRequest(BaseModel):
    name: str
    email: str


@app.get("/")
async def root():
    return {"message": "Olá, FastAPI está rodando!"}


@app.post("/register")
async def register_user(user: RegisterRequest):
    # Insere o usuário no banco de dados
    with conn.cursor() as cursor:
        try:
            cursor.execute(
                "INSERT INTO users (name, email) VALUES (%s, %s)",
                (user.name, user.email),
            )
            conn.commit()
        except psycopg2.Error as e:
            return {"error": str(e)}

    return {"message": f"Usuário {user.name} registrado com sucesso!"}


@app.get("/users")
async def get_users():
    # Retorna todos os usuários cadastrados
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, name, email FROM users")
        rows = cursor.fetchall()

    # rows é uma lista de tuplas. Vamos transformar em lista de dicionários
    users_list = []
    for row in rows:
        users_list.append({"id": row[0], "name": row[1], "email": row[2]})

    return users_list
