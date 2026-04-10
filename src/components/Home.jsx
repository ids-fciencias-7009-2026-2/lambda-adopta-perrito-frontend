import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {

      setUser({ name: "Hola, adoptante" });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>🐾 Adopta un Perrito</h1>
        <nav>
          <button onClick={() => navigate('/perfil')}>Ver Mi Perfil</button> |
          <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main style={{ marginTop: '30px' }}>
        <h2>¡Bienvenido, {user?.name}!</h2>
        <p>Esta es la pantalla principal después de hacer login.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <p>🐕 Bobby</p>
            <button disabled>Adoptar</button>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <p>🐶 Luna</p>
            <button disabled>Adoptar</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;