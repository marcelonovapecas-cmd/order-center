import { z } from "zod";

export const criarUsuarioSchema = z.object({
    nome: z
        .string()
        .min(2, 'O nome deve ter pelo menos 2 caracteres'),

    email: z
        .string()
        .email('Email inválido'),

    senha: z
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),

    cargo: z
        .enum(['EMPREGADO', 'GERENTE', 'ADMIN'])
        .default('EMPREGADO')
});