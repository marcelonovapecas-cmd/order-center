import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                erro: 'Dados inválidos',
                detalhes: resultado.error.issues
            });
        }

        req.body = resultado.data;

        next();
    };
}