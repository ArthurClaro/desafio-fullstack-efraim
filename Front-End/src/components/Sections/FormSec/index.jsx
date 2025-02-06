import { useEffect, useState } from "react";
import CountACtive from "./countActive"
import styles from "./style.module.scss"
import { useUserContext } from "../../../providers/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "./tasksSchema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"


function FormSec() {

    const { toastSuccess, createTask, updateTask, selectedTask, setSelectedTask } = useUserContext()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(createTaskSchema),
    });

    useEffect(() => {
        if (selectedTask) {
            reset({
                titulo: selectedTask.titulo,
                descricao: selectedTask.descricao,
                status: selectedTask.status,
            });
        } else {
            reset({
                titulo: "",
                descricao: "",
                status: "",
            });
        }
    }, [selectedTask, reset]);

    const onSubmit = async (formData) => {
        try {
            if (selectedTask) {
                await updateTask(selectedTask.id, formData);
                toastSuccess('Atualizado', 3000)
                setSelectedTask(null);
            } else {
                await createTask(formData);
                toastSuccess('Criado', 3000)
            }
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <section className={styles.section}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                    <label htmlFor="descript" className="paragraphTitle">Título</label>
                    <input type="text" id="descript" className="input-top"
                        {...register("titulo")}
                        placeholder="Digite o título"
                        required />

                    {errors.titulo && <p className="errorText">{errors.titulo.message}</p>}


                    <p className="paragraphEx">Ex: Comprar roupas às 17:00</p>

                    <label htmlFor="valor" className="paragraphTitle">Descrição</label>
                    <input type="text" id="valor" className="input-mediun"
                        placeholder="Digite a descrição"
                        {...register("descricao")}
                        required />
                    {errors.descricao && <p className="errorText">{errors.descricao.message}</p>}

                    <label htmlFor="plano" className="paragraphTitle">Status da Tarefa</label>
                    <Select
                        value={watch("status") || undefined}
                        onValueChange={(value) => setValue("status", value)}
                    >
                        <SelectTrigger className="
      flex
      w-[314px]
      px-4
      items-center
      gap-[10px]
      shrink-0
      [font-family:var(--font-secundary)]
      font-normal
      text-[16px]
      leading-[26px]
      text-[var(--color-exampleCompras)]
      rounded-lg
      border-2
      border-[var(--color-input)]
      bg-[var(--color-input)]
      h-[48px]
      text-left

       [&>svg]:!w-[10%]
    ">
                            <SelectValue placeholder="Selecione um status (opcional)" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="em progresso">Em Progresso</SelectItem>
                            <SelectItem value="concluída">Concluída</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                        </SelectContent>
                    </Select>



                    {errors.status && <p className="errorText">{errors.status.message}</p>}

                    <button type="submit" className="btnPink">{selectedTask ? "Atualizar valores" : "Inserir valor"}</button>
                </form>

                <CountACtive />
            </section>
        </>
    )
}
export default FormSec