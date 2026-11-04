

export type Status =
    | 'AGUARDANDO'
    | 'EM_SEPARACAO'
    | 'CONCLUIDO'
    | 'CANCELADO';

export interface ItemPedido {
    id: number;
    pedidoId: number;
    nome: string;
    quantidade: number;
    createdAt: string;
}

export interface Pedido {
    id: number;
    numero: number;
    status: Status;
    usuarioId: number;
    createdAt: string;
    updatedAt: string;

    usuario: {
        id: number;
        nome: string;
        email: string;
    };

    itens: ItemPedido[];
    eventos: EventoPedido[];
}

export interface EventoPedido {
    id: number;
    pedidoId: number;
    usuarioId: number;
    tipo:
    | 'PEDIDO_CRIADO'
    | 'STATUS_ALTERADO'
    | 'ITEM_ADICIONADO'
    | 'ITEM_REMOVIDO'
    | 'ITEM_ALTERADO';
    descricao: string;
    createdAt: string;
    usuario: {
        id: number;
        nome: string;
        cargo: 'EMPREGADO' | 'GERENTE' | 'ADMIN';
    };
}