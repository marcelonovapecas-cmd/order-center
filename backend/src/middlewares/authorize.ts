import type { Request, Response, NextFunction } from "express";
import type { Cargos } from "../generated/prisma/enums.ts";

export function autorizar(...cargosPermitidos:Cargos[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if(!req.usuario){
            return res.status(401).json({
                erro: 'Usuario não autenticado'
            });
        }

        if (!cargosPermitidos.includes(req.usuario.cargo)){
            return res.status(403).json({
                erro: 'Você não tem permissão para acessar este recurso'
            });
        }

        next();
    };
}