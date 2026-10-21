import type { Request, Response } from 'express';
import { criarPedido, adicionarItemPedido, buscarPedidoDoUsuario } from '../services/pedido.service.js';

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
    try {
        const pedidoId = Number(req.params.id);
        const usuarioId = req.usuario!.id;

        const resultado = await buscarPedidoDoUsuario(
            pedidoId,
            usuarioId
        );

        if (resultado === null) {
            return res.status(404).json({
                erro: 'Pedido não encontrado'
            });
        }

        if (resultado === false) {
            return res.status(403).json({
                erro: 'Você não pode alterar esse pedido'
            });
        }

        const { nome, quantidade } = req.body;

        const item = await adicionarItemPedido(
            pedidoId,
            nome,
            quantidade
        );

        res.status(201).json(item);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao adicionar item ao pedido'
        });
    }
}