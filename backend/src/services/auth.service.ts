import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.ts';
import jwt from 'jsonwebtoken';

export async function autenticarUsuario(email: string, senha: string) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    });

    if (!usuario) {
        throw new Error('Email ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            cargo: usuario.cargo
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: '1h'
        }
    );

    return {
        usuario,
        token
    };
}