import { Router } from "express";
import { loginController } from "../controllers/auth.controller.ts";
import { validate } from "../middlewares/validate.ts";
import { loginSchema } from "../schemas/auth.schema.ts";

const router = Router();

router.post(
    '/login',
    validate(loginSchema),
    loginController
);

export default router;