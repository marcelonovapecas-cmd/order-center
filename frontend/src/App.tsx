import { useEffect, useState } from 'react';
import { testarApi } from './services/api';
import Login from './pages/Login';
import { listarPedidos } from './services/api';
import Pedidos from './pages/Pedidos';

function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    testarApi()
      .then((dados) => {
        setMensagem(dados.mensagem);
      })
      .catch((erro) => {
        console.error("Erro na API",erro);
        setMensagem('Erro ao acessar a API');
      });
  }, []);

  useEffect(() => {
        listarPedidos()
            .then((pedidos) => {
                console.log('Pedidos:', pedidos);
            })
            .catch((erro) => {
                console.error(erro);
            });
    }, []);

  return (
    <div>
      <h1>Central de Pedidos</h1>

      <p>{mensagem}</p>
      <Login />

      <Pedidos />
    </div>
  );
}

export default App;