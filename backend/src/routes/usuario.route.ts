import { Router } from 'express';
import { criarUsuarioController } from '../controllers/usuario.controller.ts';
import { validate } from '../middlewares/validate.ts';
import { criarUsuarioSchema } from '../schemas/usuario.schema.ts';

const router = Router();

router.post(
    '/',
    validate(criarUsuarioSchema),
    criarUsuarioController
);

export default router;