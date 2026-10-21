import type { Cargos } from "../generated/prisma/client.ts";

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: number;
                cargo: Cargos;
            };
        }
    }
}