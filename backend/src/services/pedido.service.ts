import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
import { TiposEvento, Status } from '../generated/prisma/client.js';

export async function criarPedido(usuarioId: number) {
    const pedido = await prisma.$transaction(
        async (tx) => {
            const novoPedido = await tx.pedido.create({
                data: {
                    usuarioId
                }
            });

            await tx.eventoPedido.create({
                data: {
                    pedidoId: novoPedido.id,
                    usuarioId,
                    tipo: TiposEvento.PEDIDO_CRIADO,
                    descricao: `Pedido #${novoPedido.numero} criado`
                }
            });

            return novoPedido;
        }
    );

    return pedido;
}

export async function adicionarItemPedido(
    pedidoId: number,
    usuarioId: number,
    nome: string,
    quantidade: number
) {
    const pedido = await buscarPedidoDoUsuario(
        pedidoId,
        usuarioId
    );

    if (
        pedido.status === Status.CONCLUIDO ||
        pedido.status === Status.CANCELADO
    ) {
        throw new AppError(
            'Não é possível adicionar itens a um pedido finalizado ou cancelado',
            400
        );
    }

    const item = await prisma.$transaction(
        async (tx) => {
            const novoItem = await tx.itemPedido.create({
                data: {
                    pedidoId,
                    nome,
                    quantidade
                }
            });

            await tx.eventoPedido.create({
                data: {
                    pedidoId,
                    usuarioId,
                    tipo: TiposEvento.ITEM_ADICIONADO,
                    descricao: `Item "${nome}" adicionado com quantidade ${quantidade}`
                }
            });

            return novoItem;
        }
    );

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
        throw new AppError(
            'Pedido não encontrado',
            404
        );

    }

    if (pedido.usuarioId !== usuarioId) {
        throw new AppError(
            'Você não pode alterar este pedido',
            403
        );

    }

    return pedido;
}

export async function registrarEvento(
    pedidoId: number,
    usuarioId: number,
    tipo: TiposEvento,
    descricao: string
) {
    return prisma.eventoPedido.create({
        data: {
            pedidoId,
            usuarioId,
            tipo,
            descricao
        }
    });
}

export async function listarPedidosDoUsuario(usuarioId: number) {
    return prisma.pedido.findMany({
        where: {
            usuarioId
        },
        include: {
            itens: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function buscarPedidoDetalhado(
    pedidoId: number,
    usuarioId: number
) {
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: pedidoId
        },
        include: {
            itens: true,

            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            },

            eventos: {
                orderBy: { createdAt: 'desc' },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            cargo: true
                        }
                    }
                }
            }
        }
    });

    if (!pedido) {
        throw new AppError(
            'Pedido não encontrado',
            404
        );
    }

    if (pedido.usuarioId !== usuarioId) {
        throw new AppError(
            'Você não pode acessar este pedido',
            403
        );
    }

    return pedido;
}

export async function alterarStatusPedido(
    pedidoId: number,
    usuarioId: number,
    novoStatus: Status
) {
    const pedido = await buscarPedidoDoUsuario(
        pedidoId,
        usuarioId
    );

    if (pedido.status === novoStatus) {
        throw new AppError(
            'O pedido já possui este status',
            400
        );
    }

    validarTransicaoStatus(
        pedido.status,
        novoStatus
    );

    const pedidoAtualizado = await prisma.$transaction(
        async (tx) => {
            const pedidoAtualizado = await tx.pedido.update({
                where: {
                    id: pedidoId
                },
                data: {
                    status: novoStatus
                }
            });

            await tx.eventoPedido.create({
                data: {
                    pedidoId,
                    usuarioId,
                    tipo: TiposEvento.STATUS_ALTERADO,
                    descricao: `Status alterado de "${pedido.status}" para "${novoStatus}"`
                }
            });

            return pedidoAtualizado;
        }
    );

    return pedidoAtualizado;
}

function validarTransicaoStatus(
    statusAtual: Status,
    novoStatus: Status
) {
    const transicoesPermitidas: Record<Status, Status[]> = {
        AGUARDANDO: [
            Status.EM_SEPARACAO,
            Status.CANCELADO
        ],

        EM_SEPARACAO: [
            Status.CONCLUIDO,
            Status.CANCELADO
        ],

        CONCLUIDO: [],

        CANCELADO: []
    };

    const permitidos = transicoesPermitidas[statusAtual];

    if (!permitidos.includes(novoStatus)) {
        throw new AppError(
            `Não é possível alterar o status de "${statusAtual}" para "${novoStatus}"`,
            400
        );
    }
}

export async function atualizarItemPedido(
    pedidoId: number,
    itemId: number,
    usuarioId: number,
    nome?: string,
    quantidade?: number
) {
    const pedido = await buscarPedidoDoUsuario(
        pedidoId,
        usuarioId
    );

    if (
        pedido.status === Status.CONCLUIDO ||
        pedido.status === Status.CANCELADO
    ) {
        throw new AppError(
            'Não é possível alterar itens de um pedido finalizado ou cancelado',
            400
        );
    }

    const itemExistente = await prisma.itemPedido.findFirst({
        where: {
            id: itemId,
            pedidoId
        }
    });

    if (!itemExistente) {
        throw new AppError(
            'Item não encontrado neste pedido',
            404
        );
    }

    if (
        nome === undefined &&
        quantidade === undefined
    ) {
        throw new AppError(
            'Nenhum dado foi informado para alteração',
            400
        );
    }

    const nomeAlterado =
        nome !== undefined &&
        nome !== itemExistente.nome;

    const quantidadeAlterada =
        quantidade !== undefined &&
        quantidade !== itemExistente.quantidade;

    if (!nomeAlterado && !quantidadeAlterada) {
        throw new AppError(
            'Nenhuma alteração foi realizada',
            400
        );
    }

    const itemAtualizado = await prisma.$transaction(
        async (tx) => {
            const item = await tx.itemPedido.update({
                where: {
                    id: itemId
                },
                data: {
                    ...(nome !== undefined && { nome }),
                    ...(quantidade !== undefined && { quantidade })
                }
            });

            let descricao = `Item "${itemExistente.nome}" atualizado`;

            if (nomeAlterado && quantidadeAlterada) {
                descricao =
                    `Item "${itemExistente.nome}" alterado para "${nome}" com quantidade ${quantidade}`;
            } else if (nomeAlterado) {
                descricao =
                    `Nome do item alterado de "${itemExistente.nome}" para "${nome}"`;
            } else if (quantidadeAlterada) {
                descricao =
                    `Quantidade do item "${itemExistente.nome}" alterada de ${itemExistente.quantidade} para ${quantidade}`;
            }

            await tx.eventoPedido.create({
                data: {
                    pedidoId,
                    usuarioId,
                    tipo: TiposEvento.ITEM_ALTERADO,
                    descricao
                }
            });

            return item;
        }
    );

    return itemAtualizado;
}

export async function removerItemPedido(
    pedidoId: number,
    itemId: number,
    usuarioId: number
) {
    const pedido = await buscarPedidoDoUsuario(
        pedidoId,
        usuarioId
    );

    if (
        pedido.status === Status.CONCLUIDO ||
        pedido.status === Status.CANCELADO
    ) {
        throw new AppError(
            'Não é possível remover itens de um pedido finalizado ou cancelado',
            400
        );
    }

    const itemExistente = await prisma.itemPedido.findFirst({
        where: {
            id: itemId,
            pedidoId
        }
    });

    if (!itemExistente) {
        throw new AppError(
            'Item não encontrado neste pedido',
            404
        );
    }

    const itemRemovido = await prisma.$transaction(
        async (tx) => {
            const item = await tx.itemPedido.delete({
                where: {
                    id: itemId
                }
            });

            await tx.eventoPedido.create({
                data: {
                    pedidoId,
                    usuarioId,
                    tipo: TiposEvento.ITEM_REMOVIDO,
                    descricao:
                        `Item "${itemExistente.nome}" removido com quantidade ${itemExistente.quantidade}`
                }
            });

            return item;
        }
    );

    return itemRemovido;
}