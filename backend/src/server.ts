import 'dotenv/config';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { autenticar } from './middlewares/auth.ts';
import { autorizar } from './middlewares/authorize.ts'
import usuarioRoutes from './routes/usuario.route.ts';
import authRoutes from './routes/auth.route.ts';
import pedidoRoutes from './routes/pedido.route.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';

const app = express();



// 1. Middlewares
app.use(cors());
app.use(express.json());



// 2. Rotas
app.get('/', (req: Request, res: Response) => {
    res.json({
        mensagem: "API funcionando!"
    })
})
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/pedidos', pedidoRoutes);



// 3. Tratamento de erros
app.use(errorHandler);



// 4. Inicializando na porta 'PORT'
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});