import { useUserContext } from "../../../../providers/UserContext"
import styles from "./style.module.scss"

function CountACtive() {

    const { tasks, createTask } = useUserContext()


    return (
        <>
            <div className={styles.div1}>
                <div className={styles.div2}>
                    <h3 className="title1">Tarefas totais:</h3>
                    <p className="titlePink">{tasks.length}</p>
                </div>
                <p className="paragraph2">Referente a quantidade de tarefas </p>
            </div>

        </>
    )
}
export default CountACtive