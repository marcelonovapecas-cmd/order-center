import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RotaPrivada from './components/RotaPrivada';
import Pedidos from './pages/Pedidos';
import Login from './pages/Login';
import DetalhesPedido from './pages/DetalhesPedido';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RotaPrivada />}>
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedidos/:id" element={<DetalhesPedido />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/pedidos" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;