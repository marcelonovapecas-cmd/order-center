import { z } from 'zod';

export const alterarStatusPedidoSchema = z.object({
    status: z.enum([
        'AGUARDANDO',
        'EM_SEPARACAO',
        'CONCLUIDO',
        'CANCELADO'
    ])
});