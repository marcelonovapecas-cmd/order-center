import { useEffect, useState } from 'react';
import type { Pedido, Status } from '../types/pedido';
import { listarPedidos } from '../services/api';
import PedidoCard from '../components/PedidoCard';
import DetalhesPedido from './DetalhesPedido';

function Pedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [erro, setErro] = useState('');
    const [filtro, setFiltro] = useState<Status | 'TODOS'>('TODOS');
    const [pedidoSelecionado, setPedidoSelecionado] =
        useState<number | null>(null);

    useEffect(() => {
        carregarPedidos();
    }, []);

    const pedidosFiltrados =
        filtro === 'TODOS'
            ? pedidos
            : pedidos.filter((pedido) => pedido.status === filtro);

    if (pedidoSelecionado !== null) {
        return (
            <DetalhesPedido
                pedidoId={pedidoSelecionado}
                onVoltar={async () => {
                    await carregarPedidos();
                    setPedidoSelecionado(null);
                }}
            />
        );
    }

    async function carregarPedidos() {
        try {
            const dados = await listarPedidos();
            setPedidos(dados);
        } catch {
            setErro('Erro ao carregar os pedidos');
        }
    }

    return (
        <div>
            <h1>Pedidos</h1>

            {erro && <p>{erro}</p>}

            <div>
                <button onClick={() => setFiltro('TODOS')}>
                    Todos
                </button>

                <button onClick={() => setFiltro('AGUARDANDO')}>
                    Aguardando
                </button>

                <button onClick={() => setFiltro('EM_SEPARACAO')}>
                    Em separação
                </button>

                <button onClick={() => setFiltro('CONCLUIDO')}>
                    Concluídos
                </button>

                <button onClick={() => setFiltro('CANCELADO')}>
                    Cancelados
                </button>
            </div>

            {pedidosFiltrados.map((pedido) => (
                <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    onClick={() => setPedidoSelecionado(pedido.id)}
                />
            ))}
        </div>
    );
}

export default Pedidos;