import type { LoginResponse } from '../types/usuario';
import type { Pedido, Status, ItemPedido } from '../types/pedido';

const API_URL = import.meta.env.VITE_API_URL;

export async function testarApi() {
    const resposta = await fetch(`${API_URL}/`);

    if (!resposta.ok) {
        throw new Error('Erro ao acessar a API');
    }

    return resposta.json();
}

export async function login(
    email: string,
    senha: string
): Promise<LoginResponse> {
    const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            senha
        })
    });

    if (!resposta.ok) {
        throw new Error('Email ou senha inválidos');
    }

    return resposta.json();
}

function obterToken() {
    return localStorage.getItem('token');
}

export async function listarPedidos(): Promise<Pedido[]> {
    const token = obterToken();

    const resposta = await fetch(`${API_URL}/pedidos`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        throw new Error('Erro ao buscar pedidos');
    }

    return resposta.json();
}

export async function buscarPedido(
    pedidoId: number
): Promise<Pedido> {
    const token = obterToken();

    const resposta = await fetch(
        `${API_URL}/pedidos/${pedidoId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao buscar pedido');
    }

    return resposta.json();
}

export async function alterarStatusPedido(
    pedidoId: number,
    status: Status
): Promise<{ status: Status }> {
    const token = obterToken();

    const resposta = await fetch(
        `${API_URL}/pedidos/${pedidoId}/status`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao alterar status do pedido');
    }

    return resposta.json();
}

export async function adicionarItemPedido(
    pedidoId: number,
    nome: string,
    quantidade: number
): Promise<ItemPedido> {
    const token = obterToken();

    const resposta = await fetch(
        `${API_URL}/pedidos/${pedidoId}/itens`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                quantidade
            })
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao adicionar item');
    }

    return resposta.json();
}