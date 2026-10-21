import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.ts';

export async function criarUsuario(
    nome: string,
    email: string,
    senha: string,
    cargo: 'EMPREGADO' | 'GERENTE' | 'ADMIN'
) {
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,
            cargo
        },
        select: {
            id: true,
            nome: true,
            email: true,
            cargo: true,
            createdAt: true
        }
    });

    return usuario;
};