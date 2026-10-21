import { prisma } from '../lib/prisma.js';

export async function criarPedido(usuarioId: number) {
    const pedido = await prisma.pedido.create({
        data: {
            usuarioId
        }
    });

    return pedido;
}

export async function adicionarItemPedido(
    pedidoId: number,
    nome: string,
    quantidade: number
) {
    const item = await prisma.itemPedido.create({
        data: {
            pedidoId,
            nome,
            quantidade
        }
    });

    return item;
}

export async function buscarPedidoDoUsuario(
    pedidoId: number,
    usuarioId: number
) {
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: pedidoId
        }
    });

    if (!pedido) {
        return null;
    }

    if (pedido.usuarioId !== usuarioId) {
        return false;
    }

    return pedido;
}