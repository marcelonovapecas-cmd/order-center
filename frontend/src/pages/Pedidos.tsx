import { useEffect, useState } from 'react';
import type { Pedido, Status } from '../types/pedido';
import { listarPedidos, criarPedido } from '../services/api';
import PedidoCard from '../components/PedidoCard';
import { useNavigate } from 'react-router-dom';

function Pedidos() {

    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [erro, setErro] = useState('');
    const [filtro, setFiltro] = useState<Status | 'TODOS'>('TODOS');

    const [criandoPedido, setCriandoPedido] = useState(false);
    const [erroCriacao, setErroCriacao] = useState('');


    useEffect(() => {
        carregarPedidos();
    }, []);

    const pedidosFiltrados =
        filtro === 'TODOS'
            ? pedidos
            : pedidos.filter((pedido) => pedido.status === filtro);

    async function carregarPedidos() {
        try {
            const dados = await listarPedidos();
            setPedidos(dados);
        } catch {
            setErro('Erro ao carregar os pedidos');
        }
    }

    async function handleCriarPedido() {
        setErroCriacao('');
        setCriandoPedido(true);

        try {
            await criarPedido();

            await carregarPedidos();
        } catch {
            setErroCriacao(
                'Não foi possível criar o pedido'
            );
        } finally {
            setCriandoPedido(false);
        }
    }

    return (
        <div>
            <h1>Pedidos</h1>

            <button
                type="button"
                disabled={criandoPedido}
                onClick={handleCriarPedido}
            >
                {criandoPedido
                    ? 'Criando...'
                    : 'Novo pedido'}
            </button>

            {erroCriacao && <p>{erroCriacao}</p>}

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
            <br />

            {pedidosFiltrados.map((pedido) => (
                <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    onClick={() => navigate(`/pedidos/${pedido.id}`)}
                />
            ))}
        </div>
    );
}

export default Pedidos;