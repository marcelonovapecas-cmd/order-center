import type { LoginResponse } from '../types/usuario';
import type { Pedido, Status, ItemPedido } from '../types/pedido';

const API_URL = import.meta.env.VITE_API_URL;


function obterToken() {
    return localStorage.getItem('token');
}

async function fetchAutenticado(
    url: string,
    options: RequestInit = {}
) {
    const token = obterToken();

    const resposta = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    if (resposta.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';

        throw new Error('Sessão expirada');
    }

    return resposta;
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

export async function listarPedidos(): Promise<Pedido[]> {
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos`
    );

    if (!resposta.ok) {
        throw new Error('Erro ao buscar pedidos');
    }

    return resposta.json();
}

export async function buscarPedido(
    pedidoId: number
): Promise<Pedido> {
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos/${pedidoId}`
    );

    if (!resposta.ok) {
        throw new Error('Erro ao buscar pedido');
    }

    return resposta.json();
}

export async function criarPedido(): Promise<Pedido> {
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos`,
        {
            method: 'POST'
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao criar pedido');
    }

    return resposta.json();
}

export async function alterarStatusPedido(
    pedidoId: number,
    status: Status
): Promise<{ status: Status }> {

    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos/${pedidoId}/status`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
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
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos/${pedidoId}/itens`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, quantidade })
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao adicionar item');
    }

    return resposta.json();
}

export async function atualizarItemPedido(
    pedidoId: number,
    itemId: number,
    dados: {
        nome?: string;
        quantidade?: number;
    }
): Promise<ItemPedido> {
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos/${pedidoId}/itens/${itemId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao atualizar item');
    }

    return resposta.json();
}

export async function removerItemPedido(
    pedidoId: number,
    itemId: number
): Promise<ItemPedido> {
    const resposta = await fetchAutenticado(
        `${API_URL}/pedidos/${pedidoId}/itens/${itemId}`,
        {
            method: 'DELETE'
        }
    );

    if (!resposta.ok) {
        throw new Error('Erro ao remover item');
    }

    return resposta.json();
}

