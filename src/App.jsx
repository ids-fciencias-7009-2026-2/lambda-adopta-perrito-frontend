import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';

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

        {/* Redirección por defecto: si entran a la raíz (/), mandarlos al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;