import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil...</p>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Navbar />

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

                        {/* --- BOTÓN DE EDITAR AGREGADO AQUÍ --- */}
                        <button
                            onClick={() => navigate('/editar')}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                backgroundColor: '#FF9800',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            ✏️ Editar Mis Datos
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Perfil;