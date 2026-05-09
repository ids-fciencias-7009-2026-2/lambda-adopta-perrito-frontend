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
      setUser({ name: "Adoptante" });
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');

    try {
      await fetch('http://localhost:8080/usuarios/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Error al cerrar sesión en el servidor:', err);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rol');
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>🐾 Adopta un Perrito</h1>
        <nav>
          <button onClick={() => navigate('/perfil')}>Ver Mi Perfil</button> |
          <button onClick={() => navigate('/buscar')} style={{ marginLeft: '10px' }}>Buscar Mascotas</button> |
          <button onClick={() => navigate('/agregar-animal')} style={{ marginLeft: '10px' }}>Dar en Adopción</button> |
          <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main style={{ marginTop: '30px' }}>

        <div style={{ fontSize: '100px', marginTop: '20px' }}></div>

        <h2 style={{ fontSize: '2.5rem' }}>¡Bienvenido, {user?.name}!</h2>

        {/* Descripción corta e intuitiva */}
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            Bienvenido a tu portal de adopción. Aquí puedes encontrar a tu nuevo mejor amigo
            o ayudar a una mascota a encontrar un hogar lleno de amor.
            ¡Explora nuestras mascotas disponibles o publica una para adopción!
          </p>
        </div>


        <div style={{ marginTop: '50px' }}>
          <button
            onClick={() => navigate('/buscar')}
            style={{
              padding: '15px 40px',
              fontSize: '1.3rem',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            🔍 Buscar Mascotas
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;