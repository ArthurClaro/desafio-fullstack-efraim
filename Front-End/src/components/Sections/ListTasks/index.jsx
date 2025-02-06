import { useEffect } from "react"
import { useUserContext } from "../../../providers/UserContext"
import styles from "./style.module.scss"

function ListTasks() {

    const { tasks, listTasks, deleteTask, startEditing} = useUserContext()

    useEffect(() => {
        listTasks()
    }, [])

    // cons
    // const removeCard = (cardId) => {
    //     const newProducts = formData.filter(element => element.id !== cardId)
    //     setFormData(newProducts)
    // }

    const handleDelete = async (taskId) => {
        await deleteTask(taskId);
    };

    const handleEdit = (taskId) => {
        // Aqui chamamos a função do contexto
        startEditing(taskId);
        // Se o <FormSec /> estiver na mesma tela, ele vai atualizar automaticamente
        // Se estiver em outra rota, você pode "navigate('/form')" etc.
      };

    // Função para formatar "2025-02-05 16:32:57.816306" em "dd/mm/yyyy"
    const formatDate = (dateString) => {
        // Opção 1: Usar substring + split
        return dateString.slice(0, 10).split("-").reverse().join("/");

        // Opção 2: Usar objeto Date (cuidar de fusos, mas aqui normalmente resolve):
        // const dateObj = new Date(dateString);
        // const dia = String(dateObj.getDate()).padStart(2, "0");
        // const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
        // const ano = dateObj.getFullYear();
        // return `${dia}/${mes}/${ano}`;
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
                        // Definindo classe de acordo com o status
                        let liClassName = styles.li; // classe "padrão"

                        if (task.status === "pendente") {
                            // Borda cinza (E9ECEF)
                            liClassName = styles.pendente;
                        } else if (task.status === "em progresso") {
                            // Borda verde (03B898)
                            liClassName = styles.emProgresso;
                        } else if (task.status === "concluída") {
                            // Borda rosa (pink)
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