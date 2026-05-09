import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import EditarPerfil from './components/EditarPerfil';
import Register from './components/Register';
import Perfil from './components/Perfil';
import BuscarMascotas from './components/BuscarMascotas';
import DetalleAnimal from './components/DetalleAnimal';
import AgregarAnimal from './components/AgregarAnimal';

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

        {/* Ruta para buscar mascotas con filtros */}
        <Route path="/buscar" element={<BuscarMascotas />} />

        {/* Ruta para ver detalle de una mascota */}
        <Route path="/animales/:id" element={<DetalleAnimal />} />

       {/* Ruta para agregar mascota */}
        <Route path="/agregar-animal" element={<AgregarAnimal />} />

        {/* Redirección por defecto: si entran a la raíz (/), mandarlos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;