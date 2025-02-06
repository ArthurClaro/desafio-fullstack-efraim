from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import psycopg2

from fastapi_socketio import SocketManager


# Carregar variáveis do arquivo .env
load_dotenv()

# Recuperar variáveis de ambiente
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")


conn = psycopg2.connect(
    host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
)

# 3) Criar tabela "tasks" se não existir
with conn.cursor() as cursor:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            titulo VARCHAR(200) NOT NULL,
            descricao TEXT,
            status VARCHAR(50) DEFAULT 'pendente',
            data_criacao TIMESTAMP DEFAULT NOW(),
            data_atualizacao TIMESTAMP DEFAULT NOW()
        );
    """
    )
    conn.commit()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "http://localhost:5173"
    # ],  # Allows the specific origin of your React app
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6) Iniciar o gerenciador de Socket.IO dentro do FastAPI
socket_manager = SocketManager(
    app=app,
    # cors_allowed_origins=["http://localhost:5173", "*"],
    cors_allowed_origins=[
        "http://localhost:5173",
        "https://desafio-fullstack-pi.vercel.app",
        "https://desafio-fullstack-efraim.onrender.com",
    ],
    mount_location="/socket.io",
)


# -------------------------------
# MODELOS Pydantic
# -------------------------------
class TaskCreate(BaseModel):
    titulo: str
    descricao: str | None = None
    status: str | None = "pendente"  # Adicione esta linha


class TaskUpdate(BaseModel):
    id: int
    titulo: str
    descricao: str
    status: str


# -------------------------------
# ROTAS HTTP
# -------------------------------


@app.post("/tasks")
async def create_task(task: TaskCreate):
    """Criar nova tarefa."""
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO tasks (titulo, descricao, status)
            VALUES (%s, %s, %s)
            RETURNING id, titulo, descricao, status, data_criacao, data_atualizacao;
        """,
            (task.titulo, task.descricao, task.status or "pendente"),
        )
        new_task = cursor.fetchone()
        conn.commit()

    created_task = {
        "id": new_task[0],
        "titulo": new_task[1],
        "descricao": new_task[2],
        "status": new_task[3],
        "data_criacao": str(new_task[4]),
        "data_atualizacao": str(new_task[5]),
    }

    await socket_manager.emit("task_created", created_task)

    return created_task


@app.get("/tasks")
async def list_tasks():
    """Listar todas as tarefas."""
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT id, titulo, descricao, status, data_criacao, data_atualizacao FROM tasks
            ORDER BY id ASC
        """
        )
        rows = cursor.fetchall()

    tasks = []
    for row in rows:
        tasks.append(
            {
                "id": row[0],
                "titulo": row[1],
                "descricao": row[2],
                "status": row[3],
                "data_criacao": str(row[4]),
                "data_atualizacao": str(row[5]),
            }
        )
    return tasks


@app.put("/tasks/{task_id}")
async def update_task(task_id: int, data: TaskUpdate):
    """Atualizar tarefa existente."""
    with conn.cursor() as cursor:
        cursor.execute(
            """
            UPDATE tasks
            SET titulo = %s,
                descricao = %s,
                status = %s,
                data_atualizacao = NOW()
            WHERE id = %s
            RETURNING id, titulo, descricao, status, data_criacao, data_atualizacao;
        """,
            (data.titulo, data.descricao, data.status, task_id),
        )
        updated = cursor.fetchone()
        conn.commit()

    if not updated:
        return {"error": "Tarefa não encontrada."}

    updated_task = {
        "id": updated[0],
        "titulo": updated[1],
        "descricao": updated[2],
        "status": updated[3],
        "data_criacao": str(updated[4]),
        "data_atualizacao": str(updated[5]),
    }

    await socket_manager.emit("task_updated", updated_task)

    return updated_task


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    """Deletar uma tarefa pelo ID."""
    with conn.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM tasks
            WHERE id = %s
            RETURNING id;
        """,
            (task_id,),
        )
        deleted = cursor.fetchone()
        conn.commit()

    if not deleted:
        return {"error": "Tarefa não encontrada."}

    await socket_manager.emit("task_deleted", {"id": task_id})

    return {"message": f"Tarefa {task_id} deletada com sucesso."}


# -------------------------------
# EVENTOS SOCKET.IO (opcionais)
# -------------------------------


@app.get("/")
async def root():
    return {"message": "Olá, FastAPI está rodando!"}


@socket_manager.on("connect")
async def handle_connect(sid, environ):
    print(f"Cliente conectado: {sid}")


@socket_manager.on("disconnect")
async def handle_disconnect(sid):
    print(f"Cliente desconectado: {sid}")
