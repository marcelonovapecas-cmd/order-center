import type { Request, Response } from 'express';
import type { Status } from '../generated/prisma/client.js';
import { criarPedido, adicionarItemPedido, buscarPedidoDoUsuario, listarPedidosDoUsuario, buscarPedidoDetalhado, alterarStatusPedido, atualizarItemPedido, removerItemPedido } from '../services/pedido.service.js';

export async function criarPedidoController(
    req: Request,
    res: Response
) {
    try {
        const usuarioId = req.usuario!.id;

        const pedido = await criarPedido(usuarioId);

        res.status(201).json(pedido);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar pedido'
        });
    }
}

export async function adicionarItemPedidoController(
    req: Request,
    res: Response
) {
    const pedidoId = Number(req.params.id);
    const usuarioId = req.usuario!.id;

    const resultado = await buscarPedidoDoUsuario(
        pedidoId,
        usuarioId
    );

    const { nome, quantidade } = req.body;

    const item = await adicionarItemPedido(
        pedidoId,
        usuarioId,
        nome,
        quantidade
    );

    res.status(201).json(item);
}

export async function listarPedidosController(
    req: Request,
    res: Response
) {
    const usuarioId = req.usuario!.id;

    const pedidos = await listarPedidosDoUsuario(usuarioId);

    res.json(pedidos);
}

export async function buscarPedidoController(
    req: Request,
    res: Response
) {
    const pedidoId = Number(req.params.id);
    const usuarioId = req.usuario!.id;

    const pedido = await buscarPedidoDetalhado(
        pedidoId,
        usuarioId
    );

    res.json(pedido);
}

export async function alterarStatusPedidoController(
    req: Request,
    res: Response
) {
    const pedidoId = Number(req.params.id);
    const usuarioId = req.usuario!.id;

    const { status } = req.body;

    const pedido = await alterarStatusPedido(
        pedidoId,
        usuarioId,
        status as Status
    );

    res.json(pedido);
}

export async function atualizarItemPedidoController(
    req: Request,
    res: Response
) {
    const pedidoId = Number(req.params.pedidoId);
    const itemId = Number(req.params.itemId);
    const usuarioId = req.usuario!.id;

    const { nome, quantidade } = req.body;

    const item = await atualizarItemPedido(
        pedidoId,
        itemId,
        usuarioId,
        nome,
        quantidade
    );

    res.json(item);
}

export async function removerItemPedidoController(
    req: Request,
    res: Response
) {
    const pedidoId = Number(req.params.pedidoId);
    const itemId = Number(req.params.itemId);
    const usuarioId = req.usuario!.id;

    const item = await removerItemPedido(
        pedidoId,
        itemId,
        usuarioId
    );

    res.json(item);
}