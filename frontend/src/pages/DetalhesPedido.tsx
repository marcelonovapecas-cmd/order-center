import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { buscarPedido, alterarStatusPedido, adicionarItemPedido } from '../services/api';
import type { Pedido, Status } from '../types/pedido';


interface DetalhesPedidoProps {
    pedidoId: number;
    onVoltar: () => void;
}

function DetalhesPedido({ pedidoId, onVoltar }: DetalhesPedidoProps) {

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [erro, setErro] = useState('');

    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [erroStatus, setErroStatus] = useState('');

    const [nomeItem, setNomeItem] = useState('');
    const [quantidadeItem, setQuantidadeItem] = useState('');
    const [erroItem, setErroItem] = useState('');
    const [adicionandoItem, setAdicionandoItem] = useState(false);

    useEffect(() => {
        buscarPedido(pedidoId)
            .then((dados) => {
                setPedido(dados);
            })
            .catch(() => {
                setErro('Erro ao carregar o pedido');
            });
    }, [pedidoId]);

    if (erro) {
        return <p>{erro}</p>;
    }

    if (!pedido) {
        return <p>Carregando...</p>;
    }

    async function handleAlterarStatus(novoStatus: Status) {
        if (!pedido) return;

        setAlterandoStatus(true);
        setErroStatus('');

        try {
            const resposta = await alterarStatusPedido(
                pedido.id,
                novoStatus
            );

            setPedido({
                ...pedido,
                status: resposta.status
            });
        } catch {
            setErroStatus('Não foi possível alterar o status');
        } finally {
            setAlterandoStatus(false);
        }
    }

    async function handleAdicionarItem(
        event: FormEvent
    ) {
        event.preventDefault();

        if (!pedido) return;

        setErroItem('');
        setAdicionandoItem(true);

        try {
            await adicionarItemPedido(
                pedido.id,
                nomeItem,
                Number(quantidadeItem)
            );

            const pedidoAtualizado = await buscarPedido(pedido.id);

            setPedido(pedidoAtualizado);

            setNomeItem('');
            setQuantidadeItem('');
        } catch {
            setErroItem('Não foi possível adicionar o item');
        } finally {
            setAdicionandoItem(false);
        }
    }

    return (
        <div>
            <button type="button" onClick={onVoltar}>
                Voltar para pedidos
            </button>

            <h1>Pedido #{pedido.numero}</h1>

            <p>Cliente: {pedido.usuario.nome}</p>

            <p>Status: {pedido.status}</p>

            <h2>Alterar status</h2>

            {pedido.status === 'AGUARDANDO' && (
                <>
                    <button
                        disabled={alterandoStatus}
                        onClick={() => handleAlterarStatus('EM_SEPARACAO')}
                    >
                        Iniciar separação
                    </button>

                    <button
                        disabled={alterandoStatus}
                        onClick={() => handleAlterarStatus('CANCELADO')}
                    >
                        Cancelar pedido
                    </button>
                </>
            )}

            {pedido.status === 'EM_SEPARACAO' && (
                <>
                    <button
                        disabled={alterandoStatus}
                        onClick={() => handleAlterarStatus('CONCLUIDO')}
                    >
                        Concluir pedido
                    </button>

                    <button
                        disabled={alterandoStatus}
                        onClick={() => handleAlterarStatus('CANCELADO')}
                    >
                        Cancelar pedido
                    </button>
                </>
            )}

            {(pedido.status === 'CONCLUIDO' ||
                pedido.status === 'CANCELADO') && (
                    <p>Este pedido não possui mais ações disponíveis.</p>
                )}

            {erroStatus && <p>{erroStatus}</p>}

            <h2>Itens</h2>

            {pedido.itens.map((item) => (
                <div key={item.id}>
                    <p>
                        {item.nome} - {item.quantidade} unidades
                    </p>
                </div>
            ))}

            {pedido.status !== 'CONCLUIDO' &&
                pedido.status !== 'CANCELADO' && (
                    <form onSubmit={handleAdicionarItem}>
                        <h3>Adicionar item</h3>

                        <input
                            type="text"
                            placeholder="Nome do item"
                            value={nomeItem}
                            onChange={(event) =>
                                setNomeItem(event.target.value)
                            }
                        />

                        <input
                            type="number"
                            min="1"
                            placeholder="Quantidade"
                            value={quantidadeItem}
                            onChange={(event) =>
                                setQuantidadeItem(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={adicionandoItem}
                        >
                            {adicionandoItem
                                ? 'Adicionando...'
                                : 'Adicionar item'}
                        </button>

                        {erroItem && <p>{erroItem}</p>}
                    </form>
                )}

            <h2>Histórico</h2>

            {pedido.eventos.map((evento) => (
                <div key={evento.id}>
                    <p>{evento.descricao}</p>
                    <small>
                        Por: {evento.usuario.nome}
                    </small>
                </div>
            ))}
        </div>
    );
}

export default DetalhesPedido;