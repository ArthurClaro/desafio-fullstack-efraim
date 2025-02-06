import { useEffect } from "react"
import { useUserContext } from "../../../providers/UserContext"
import styles from "./style.module.scss"

function ListTasks() {

    const { tasks, listTasks, deleteTask, startEditing} = useUserContext()

    useEffect(() => {
        listTasks()
    }, [])

    const handleDelete = async (taskId) => {
        await deleteTask(taskId);
    };

    const handleEdit = (taskId) => {
        startEditing(taskId);
      };

    const formatDate = (dateString) => {
        return dateString.slice(0, 10).split("-").reverse().join("/");
    };

    return (
        <section className={styles.section}>
            <div className={styles.seeALter}>
                <h3 className="title1">Resumo de Tarefas</h3>
                <div>
                    <p className="title1"><span>●</span> Pendente</p>
                    <p className="title1"><span>●</span> Em progresso</p>
                    <p className="title1"><span>●</span> Concluido</p>
                </div>
            </div>

            {tasks.length > 0 ? (
                <ul className={styles.ulGap}>
                    {tasks.map((task) => {
                        let liClassName = styles.li; 

                        if (task.status === "pendente") {
                            liClassName = styles.pendente;
                        } else if (task.status === "em progresso") {
                            liClassName = styles.emProgresso;
                        } else if (task.status === "concluída") {
                            liClassName = styles.concluida;
                        }

                        return (
                            <li className={liClassName} key={task.id}>
                                <div className={styles.divTop}>
                                    <h3 className="title1">{task.titulo}</h3>
                                    <p className="paragraph2">{task.descricao}</p>
                                </div>
                                <div className={styles.divBottom}>
                                    <p className="paragraphPrice">{formatDate(task.data_criacao)}</p>
                                    <div className={styles.divChoose}>
                                        <button className="btnCard" onClick={() => handleDelete(task.id)}>
                                            Excluir
                                        </button>
                                        <button className="btnCard" onClick={() => handleEdit(task.id)}>
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.not}>Você ainda não possui nenhuma tarefa cadastrada</p>
            )}
        </section>
    )
}
export default ListTasks