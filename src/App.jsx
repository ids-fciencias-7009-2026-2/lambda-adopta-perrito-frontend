import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import EditarPerfil from './components/EditarPerfil';
import Register from './components/Register';
import Perfil from './components/Perfil';
import BuscarMascotas from './components/BuscarMascotas';
import DetalleAnimal from './components/DetalleAnimal';
import AgregarAnimal from './components/AgregarAnimal';
import EditarAnimal from './components/EditarAnimal';
import MisMascotas from './components/MisMascotas';
import AgregarMascotaPerdida from './components/AgregarMascotaPerdida';

function App() {
  return (
      <Router>
        <Routes>
          {/* Ruta de Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta de Home */}
          <Route path="/home" element={<Home />} />

          {/* Ruta del Register */}
          <Route path="/register" element={<Register />} />

          {/* Ruta del Perfil */}
          <Route path="/perfil" element={<Perfil />} />

          {/* Ruta para editar perfil */}
          <Route path="/editar" element={<EditarPerfil />} />

          {/* Ruta para ver las mascotas que el usuario ha publicado */}
          <Route path="/mis-mascotas" element={<MisMascotas />} />

          {/* Ruta para buscar mascotas con filtros */}
          <Route path="/adoptar" element={<BuscarMascotas />} />

          {/* Ruta para mascotas perdidas */}
          <Route path="/perdidas" element={<div style={{textAlign:'center', marginTop:'50px'}}><h1>Próximamente Mascotas Perdidas</h1></div>} />

          {/* Ruta para ver detalle de una mascota */}
          <Route path="/animales/:id" element={<DetalleAnimal />} />

          {/* Ruta para agregar una mascota */}
          <Route path="/agregar-animal" element={<AgregarAnimal />} />

          {/* Ruta para editar una mascota */}
          <Route path="/animales/:id/editar" element={<EditarAnimal />} />

          {/* Ruta para agregar una mascota pérdida*/}
          <Route path="/agregar-perdida" element={<AgregarMascotaPerdida />} />

          {/* Redirección por defecto: si entran a la raíz (/), mandarlos al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
  );
}

export default App;