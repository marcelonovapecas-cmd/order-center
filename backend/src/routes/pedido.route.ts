import { Router } from 'express';
import { criarPedidoController, adicionarItemPedidoController } from '../controllers/pedido.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.ts';
import { criarItemPedidoSchema } from '../schemas/item-pedido.schema.ts';

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

export default router;