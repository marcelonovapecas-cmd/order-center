import { Router } from 'express';
import { criarPedidoController, adicionarItemPedidoController, listarPedidosController, buscarPedidoController, alterarStatusPedidoController, atualizarItemPedidoController, removerItemPedidoController } from '../controllers/pedido.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.ts';
import { criarItemPedidoSchema } from '../schemas/item-pedido.schema.ts';
import { alterarStatusPedidoSchema } from '../schemas/status-pedido.schema.ts';
import { atualizarItemPedidoSchema } from '../schemas/atualizar-item-pedido.schema.ts';

const router = Router();

router.post(
    '/',
    autenticar,
    criarPedidoController
);

router.post(
    '/:id/itens',
    autenticar,
    validate(criarItemPedidoSchema),
    adicionarItemPedidoController
);

router.get(
    '/',
    autenticar,
    listarPedidosController
);

router.get(
    '/:id',
    autenticar,
    buscarPedidoController
);

router.put(
    '/:id/status',
    autenticar,
    validate(alterarStatusPedidoSchema),
    alterarStatusPedidoController
);

router.patch(
    '/:pedidoId/itens/:itemId',
    autenticar,
    validate(atualizarItemPedidoSchema),
    atualizarItemPedidoController
);

router.delete(
    '/:pedidoId/itens/:itemId',
    autenticar,
    removerItemPedidoController
);



export default router;