import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import EditarPerfil from './components/EditarPerfil';
import Register from './components/Register';
import Perfil from './components/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de Home */}
        <Route path="/home" element={<Home />} />

        {/* Ruta para editar perfil */}
        <Route path="/editar" element={<EditarPerfil />} />

        {/* Ruta del Register */}
        <Route path="/register" element={<Register />} />

        {/* Ruta del Perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Redirección por defecto: si entran a la raíz (/), mandarlos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;