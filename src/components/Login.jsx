import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem('token', data.token);

        navigate('/home');
      } else {
        setError('Credenciales inválidas. Revisa tu correo o contraseña.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Adopta un Perrito 🐾</h1>
      <h3>Iniciar Sesión</h3>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ cursor: 'pointer', padding: '10px' }}>
          Ingresar
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}


      <p style={{ marginTop: '20px' }}>
        ¿No tienes cuenta?{' '}
        <span
          onClick={() => navigate('/register')}
          style={{ color: 'cyan', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  );
};

export default Login;