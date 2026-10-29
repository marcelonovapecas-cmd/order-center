import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            erro: err.message
        });
    }

    return res.status(500).json({
        erro: 'Erro interno do servidor'
    });
}