import type { Request, Response } from 'express';
import { autenticarUsuario } from '../services/auth.service.ts';

export async function loginController(
    req: Request,
    res: Response,
) {
    try {
        const { email, senha } = req.body;

        const {usuario, token } = await autenticarUsuario(email, senha);

        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            }
        });
    } catch (error) {
        console.log(error)

        res.status(401).json({
            erro: 'Email ou senha inválidos'
        });
    }
}