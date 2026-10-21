import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function autenticar(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token não informado'
        });
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            erro: 'Token inválido'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        if (typeof payload === 'string'){
            return res.status(401).json({
                erro:'Token inválido'
            });
        }

        req.usuario = {
            id: payload.id as number,
            cargo: payload.cargo as 'EMPREGADO' | 'GERENTE' | 'ADMIN'
        }

        next();
    } catch (error) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado'
        });
    }
}