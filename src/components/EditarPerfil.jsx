import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarPerfil = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/usuarios/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNombre(data.nombre);
          setEmail(data.email);
          setCodigoPostal(data.codigoPostal);
        } else {
          setError('No se pudieron cargar los datos');
        }
      } catch {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  //  ACTUALIZAR DATOS GENERALES
  const handleUpdateDatos = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          email,
          codigoPostal
        })
      });

      if (response.ok) {
        setMensaje('Datos actualizados correctamente ✅');
      } else {
        setError('Error al actualizar los datos');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  //  ACTUALIZAR CONTRASEÑA
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!password || !confirmPassword) {
      setError('Debes llenar ambos campos de contraseña');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden ❌');
      return;
    }

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password
        })
      });

      if (response.ok) {
        setMensaje('Contraseña actualizada correctamente 🔐');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Error al actualizar la contraseña');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>🐾 Adopta un Perrito</h1>
        <nav>
          <button onClick={() => navigate('/home')}>Home</button> |
          <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main style={{ marginTop: '30px' }}>
        <h2>Editar Perfil</h2>

        {/* FORM DATOS */}
        <form
          onSubmit={handleUpdateDatos}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px',
            margin: '20px auto'
          }}
        >
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
          />

          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            placeholder="Código Postal"
            required
          />

          <button type="submit">Guardar Datos</button>
        </form>

        {/* FORM CONTRASEÑA */}
        <form
          onSubmit={handleUpdatePassword}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px',
            margin: '30px auto'
          }}
        >
          <p><strong>Cambiar Contraseña</strong></p>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Cambiar Contraseña</button>
        </form>

        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    </div>
  );
};

export default EditarPerfil;