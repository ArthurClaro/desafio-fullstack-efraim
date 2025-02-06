import { z } from "zod";

export const createTaskSchema = z.object({
  titulo: z.string().nonempty("O título é obrigatório."),
  descricao: z.string().nonempty("A descrição é obrigatória."),
  status: z
    .union([
      z.literal(""),
      z.enum(["pendente", "em progresso", "concluída"])
    ])
    .transform(val => val === "" ? "pendente" : val)
});