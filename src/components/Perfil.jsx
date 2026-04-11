import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        // Verifica que exista una sesión activa antes de intentar cargar la vista
        if (!token) {
            navigate('/login');
            return;
        }

        // Recupera los datos del usuario autenticado desde el backend
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/usuarios/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data);
                } else {
                    setError('No se pudieron cargar los datos del perfil.');
                }
            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    // Invalida el token en el servidor y limpia el almacenamiento local
    const handleLogout = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/usuarios/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
        } catch (err) {
            console.error('Error al procesar el cierre de sesión:', err);
        } finally {
            sessionStorage.removeItem('token');
            navigate('/login');
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil...</p>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h1>Adopta un Perrito</h1>
                <nav>
                    <button onClick={() => navigate('/home')}>Home</button> |
                    <button onClick={() => navigate('/editar')} style={{ marginLeft: '10px' }}>Editar Datos</button> |
                    <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            <main style={{ marginTop: '30px' }}>
                <h2>Mi Perfil</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {usuario && (
                    <div style={{
                        border: '1px solid #ddd',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        margin: '20px auto',
                        textAlign: 'left',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> {usuario.email}</p>
                        <p><strong>Código Postal:</strong> {usuario.codigoPostal}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Perfil;