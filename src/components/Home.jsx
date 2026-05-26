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
      sessionStorage.clear();
      navigate('/login');
    }
  };

  return (
      <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>

        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', color: '#333' }}>🐾 AdoptaPerrito</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px', maxWidth: '600px' }}>
          ¡Bienvenido a tu portal! Encuentra a tu nuevo mejor amigo, ayuda a una mascota a encontrar hogar, o reporta si has perdido a la tuya.
        </p>

        {/* BOTONES CENTRALES GRANDES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '800px', width: '100%' }}>

          <button onClick={() => navigate('/perfil')} style={{ padding: '30px', fontSize: '1.5rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '3rem' }}>👤</span> Mi Perfil
          </button>

          <button onClick={() => navigate('/mis-mascotas')} style={{ padding: '30px', fontSize: '1.5rem', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '3rem' }}>🐕</span> Mis Mascotas
          </button>

          <button onClick={() => navigate('/adoptar')} style={{ padding: '30px', fontSize: '1.5rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '3rem' }}>🏡</span> Adoptar
          </button>

          <button onClick={() => navigate('/perdidas')} style={{ padding: '30px', fontSize: '1.5rem', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span> Mascotas Perdidas
          </button>

        </div>

        <button onClick={handleLogout} style={{ marginTop: '50px', padding: '10px 30px', fontSize: '1rem', backgroundColor: 'transparent', color: '#888', border: '2px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>
  );
};

export default Home;