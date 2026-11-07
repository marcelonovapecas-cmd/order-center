import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { buscarPedido, alterarStatusPedido, adicionarItemPedido, atualizarItemPedido, removerItemPedido } from '../services/api';
import type { Pedido, Status } from '../types/pedido';
import { useParams, useNavigate } from 'react-router-dom';


function DetalhesPedido() {

    const { id } = useParams();
    const navigate = useNavigate();
    const pedidoId = Number(id);

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [erro, setErro] = useState('');

    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [erroStatus, setErroStatus] = useState('');

    const [nomeItem, setNomeItem] = useState('');
    const [quantidadeItem, setQuantidadeItem] = useState('');
    const [erroItem, setErroItem] = useState('');
    const [adicionandoItem, setAdicionandoItem] = useState(false);

    const [itemEditando, setItemEditando] = useState<number | null>(null);
    const [nomeEditado, setNomeEditado] = useState('');
    const [quantidadeEditada, setQuantidadeEditada] = useState('');
    const [erroEdicao, setErroEdicao] = useState('');
    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [removendoItem, setRemovendoItem] = useState<number | null>(null);
    const [erroRemocao, setErroRemocao] = useState('');

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
            await alterarStatusPedido(
                pedido.id,
                novoStatus
            );

            const pedidoAtualizado = await buscarPedido(pedido.id);

            setPedido(pedidoAtualizado);
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

    function iniciarEdicao(
        itemId: number,
        nome: string,
        quantidade: number
    ) {
        setItemEditando(itemId);
        setNomeEditado(nome);
        setQuantidadeEditada(String(quantidade));
        setErroEdicao('');
    }

    async function salvarEdicao() {
        if (!pedido || itemEditando === null) {
            return;
        }

        setErroEdicao('');
        setSalvandoEdicao(true);

        try {
            await atualizarItemPedido(
                pedido.id,
                itemEditando,
                {
                    nome: nomeEditado,
                    quantidade: Number(quantidadeEditada)
                }
            );

            const pedidoAtualizado = await buscarPedido(
                pedido.id
            );

            setPedido(pedidoAtualizado);
            setItemEditando(null);
        } catch {
            setErroEdicao(
                'Não foi possível atualizar o item'
            );
        } finally {
            setSalvandoEdicao(false);
        }
    }

    async function handleRemoverItem(itemId: number) {
        if (!pedido) return;

        setErroRemocao('');
        setRemovendoItem(itemId);

        try {
            await removerItemPedido(
                pedido.id,
                itemId
            );

            const pedidoAtualizado = await buscarPedido(
                pedido.id
            );

            setPedido(pedidoAtualizado);
        } catch {
            setErroRemocao(
                'Não foi possível remover o item'
            );
        } finally {
            setRemovendoItem(null);
        }
    }

    return (
        <div>
            <button onClick={() => navigate('/pedidos')}>
                Voltar
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
                    {itemEditando === item.id ? (
                        <div>
                            <input
                                type="text"
                                value={nomeEditado}
                                onChange={(event) =>
                                    setNomeEditado(event.target.value)
                                }
                            />

                            <input
                                type="number"
                                min="1"
                                value={quantidadeEditada}
                                onChange={(event) =>
                                    setQuantidadeEditada(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                disabled={salvandoEdicao}
                                onClick={salvarEdicao}
                            >
                                {salvandoEdicao
                                    ? 'Salvando...'
                                    : 'Salvar'}
                            </button>

                            <button
                                type="button"
                                disabled={salvandoEdicao}
                                onClick={() => setItemEditando(null)}
                            >
                                Cancelar
                            </button>

                            {erroEdicao && <p>{erroEdicao}</p>}
                        </div>
                    ) : (
                        <div>
                            <p>
                                {item.nome} - {item.quantidade} unidades
                            </p>

                            {pedido.status !== 'CONCLUIDO' &&
                                pedido.status !== 'CANCELADO' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                iniciarEdicao(
                                                    item.id,
                                                    item.nome,
                                                    item.quantidade
                                                )
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            disabled={removendoItem === item.id}
                                            onClick={() =>
                                                handleRemoverItem(item.id)
                                            }
                                        >
                                            {removendoItem === item.id
                                                ? 'Removendo...'
                                                : 'Remover'}
                                        </button>
                                    </>
                                )}
                        </div>
                    )}
                </div>
            ))}

            {erroRemocao && <p>{erroRemocao}</p>}

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