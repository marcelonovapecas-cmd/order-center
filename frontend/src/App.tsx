import { useEffect, useState } from 'react';
import { testarApi } from './services/api';

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

  return (
    <div>
      <h1>Central de Pedidos</h1>

      <p>{mensagem}</p>
    </div>
  );
}

export default App;