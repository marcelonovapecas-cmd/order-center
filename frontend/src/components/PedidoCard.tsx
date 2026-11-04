import type { Pedido } from '../types/pedido';

interface PedidoCardProps {
    pedido: Pedido;
    onClick: () => void;
}

function PedidoCard({ pedido, onClick }: PedidoCardProps) {
    const quantidadeTotal = pedido.itens.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    return (
        <button type="button" onClick={onClick}>
            <h2>Pedido #{pedido.numero}</h2>
            <p>Cliente: {pedido.usuario.nome}</p>
            <p>Status: {pedido.status}</p>
            <p>{quantidadeTotal} peças</p>
            <span>Ver detalhes</span>
        </button>
    );
}

export default PedidoCard;