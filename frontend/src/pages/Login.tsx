import { useState } from 'react';
import { login } from '../services/api';
import type { FormEvent } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleLogin(
        event: FormEvent
    ) {
        event.preventDefault();

        setErro('');

        try {
            const resposta = await login(
                email,
                senha
            );

            localStorage.setItem('token', resposta.token);

            console.log('Login realizado:', resposta);
        } catch (error) {
            setErro('Email ou senha inválidos');
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) =>
                        setSenha(event.target.value)
                    }
                />

                <button type="submit">
                    Entrar
                </button>

                {erro && <p>{erro}</p>}
            </form>
        </div>
    );
}

export default Login;