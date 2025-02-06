import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import 'primeicons/primeicons.css';
import { io } from "socket.io-client";


export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    function toastSuccess(message, time) {
        toast.success(capitalizeFirst(message), {
            position: "top-right",
            autoClose: time,
            style: { background: "black", color: "#F8F9FA" },
        });
    }
    function toastErro(message, time) {
        toast.error(capitalizeFirst(message), {
            position: "top-right",
            autoClose: time,
            style: { background: "black", color: "#F8F9FA" },
        });
    }
    // helper para capitalizar a primeira letra de qualquer mensagem:
    function capitalizeFirst(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    // const socket = io("https://desafio-fullstack-efraim.onrender.com", {
    //     transports: ["websocket"],
    //   });

    // Para sockets, você precisa de outra URL (string), ex:
    // const socket = io("http://127.0.0.1:8000", {
    //     path: "/socket.io",               // idêntico ao mount_location do backend
    //     transports: ["websocket", "polling"]
    // });
    // // socket.on("connect", () => {
    // //     console.log("Socket conectado. ID:", socket.id);
    // // });
    // // socket.on("disconnect", () => {
    // //     console.log("Socket desconectado!");
    // // });



    const navigate = useNavigate();


    // Guardar as tasks em um estado local
    const [tasks, setTasks] = useState([]);


    const [selectedTask, setSelectedTask] = useState(null);



    const socket = useMemo(
        () =>
            io("http://127.0.0.1:8000", {
                path: "/socket.io", // tem que bater com mount_location do backend
                transports: ["websocket", "polling"],
            }),
        []
    );

    // useEffect para lidar com eventos do socket
    useEffect(() => {
        // Quando conectar
        socket.on("connect", () => {
            console.log("Socket.IO conectado! ID:", socket.id);
        });

        // Evento de criação de tarefa
        socket.on("task_created", (newTask) => {
            console.log("Nova tarefa criada em tempo real:", newTask);
            setTasks((oldTasks) => [...oldTasks, newTask]);
        });

        // Evento de atualização de tarefa
        socket.on("task_updated", (updatedTask) => {
            console.log("Tarefa atualizada em tempo real:", updatedTask);
            setTasks((oldTasks) =>
                oldTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
        });

        // Evento de deleção de tarefa
        socket.on("task_deleted", ({ id }) => {
            console.log("Tarefa deletada em tempo real, ID:", id);
            setTasks((oldTasks) => oldTasks.filter((t) => t.id !== id));
        });

        // Quando desconectar
        socket.on("disconnect", () => {
            console.log("Socket.IO desconectado!");
        });

        // Cleanup quando componente desmontar (ou re-montar em StrictMode)
        return () => {
            // Em dev com StrictMode, esse disconnect vai ser chamado 2x.
            // Em produção ele só roda quando o Provider sair de cena mesmo.
            socket.disconnect();
        };
    }, [socket]);



    // -------------------------------------------------------
    // FUNÇÕES CRUD (CHAMADAS HTTP)
    // -------------------------------------------------------
    /**
     * CREATE
     * POST /tasks
     */
    const createTask = async (formData) => {
        try {
            const { data } = await api.post("/tasks", formData);
            // O socket do backend também emite "task_created",
            // que chegará em tempo real e atualizará o estado local (tasks).
            console.log("Tarefa criada via HTTP:", data);
            return data;
        } catch (error) {
            console.error(error);
            toastErro("Não foi possível criar a tarefa", 2000);
        }
    };

    /**
     * READ
     * GET /tasks
     */
    const listTasks = async () => {
        try {
            const { data } = await api.get("/tasks");
            // data deve ser um array de tarefas
            console.log("Listagem de tarefas:", data);
            setTasks(data);
            return data;
        } catch (error) {
            console.error(error);
            toastErro("Não foi possível listar as tarefas", 2000);
        }
    };

    /**
     * UPDATE
     * PUT /tasks/:id
     */
    const updateTask = async (taskId, updateData) => {
        try {
            const body = { id: taskId, ...updateData };
            const { data } = await api.put(`/tasks/${taskId}`, body);
            // O socket do backend também emite "task_updated"
            console.log("Tarefa atualizada via HTTP:", data);
            return data;
        } catch (error) {
            console.error(error);
            toastErro("Não foi possível atualizar a tarefa", 2000);
        }
    };

    /**
     * DELETE
     * DELETE /tasks/:id
     */
    const deleteTask = async (taskId) => {
        try {
            const { data } = await api.delete(`/tasks/${taskId}`);
            // O socket do backend também emite "task_deleted"
            console.log("Tarefa deletada via HTTP:", data);
            return data;
        } catch (error) {
            console.error(error);
            toastErro("Não foi possível deletar a tarefa", 2000);
        }
    };


    // ---------------------------------------------
    // Função para iniciar edição de uma determinada task
    // ---------------------------------------------
    const startEditing = (taskId) => {
        const taskToEdit = tasks.find((t) => t.id === taskId);
        if (taskToEdit) {
            setSelectedTask(taskToEdit);
        }
    };




    return (
        <UserContext.Provider value={{
            tasks,        // para usar a lista de tarefas no front
            createTask,
            listTasks,
            updateTask,
            deleteTask,

            // Edição
            selectedTask,    // a tarefa que está sendo editada
            setSelectedTask, // se quiser limpar depois
            startEditing,    // função p/ iniciar edição
            toastSuccess
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)
