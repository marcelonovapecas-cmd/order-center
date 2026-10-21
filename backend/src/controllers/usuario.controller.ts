import type { Request, Response } from 'express';
import { criarUsuario } from '../services/usuario.service.ts';

export async function criarUsuarioController(
    req: Request,
    res: Response
) {
    try {
        const { nome, email, senha, cargo } = req.body;

        const usuario = await criarUsuario(
            nome,
            email,
            senha,
            cargo
        );

        res.status(201).json(usuario);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            erro: 'Erro ao criar usuário!'
        });
    }
};