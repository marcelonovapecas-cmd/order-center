import { z } from 'zod';

export const criarItemPedidoSchema = z.object({
    nome: z
        .string()
        .min(1, 'O nome do item é obrigatório'),

    quantidade: z
        .number()
        .int('A quantidade deve ser um número inteiro')
        .positive('A quantidade deve ser maior que zero')
});