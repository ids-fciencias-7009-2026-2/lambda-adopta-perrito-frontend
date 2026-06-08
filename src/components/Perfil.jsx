import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [misAdopciones, setMisAdopciones] = useState([]);
    const [misPerdidas, setMisPerdidas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        // Verifica que exista una sesión activa antes de intentar cargar la vista
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchPerfilYMascotas = async () => {
            try {
                const userResponse = await fetch('http://localhost:8080/usuarios/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUsuario(userData);
                } else {
                    setError('No se pudieron cargar los datos del perfil.');
                }

                //Mascotas en Atopción
                const adopcionesResponse = await fetch('http://localhost:8080/animales/mis-animales', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (adopcionesResponse.ok) {
                    const adopcionesData = await adopcionesResponse.json();
                    setMisAdopciones(Array.isArray(adopcionesData) ? adopcionesData : []);
                }


                const perdidasResponse = await fetch('http://localhost:8080/mascotas-desaparecidas/mis-mascotas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (perdidasResponse.ok) {
                    const perdidasData = await perdidasResponse.json();
                    setMisPerdidas(Array.isArray(perdidasData) ? perdidasData : []);
                }

            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchPerfilYMascotas();
    }, [navigate]);

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
            sessionStorage.removeItem('rol');
            navigate('/login');
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil...</p>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h1>🐾 Adopta un Perrito</h1>
                <nav>
                    <button className="btn-principal" onClick={() => navigate('/home')}>Home</button> |
                    <button className="btn-principal" onClick={() => navigate('/editar')} style={{ marginLeft: '10px' }}>Editar Datos</button> |
                    <button className="btn-principal btn-logout" onClick={handleLogout} style={{ marginLeft: '10px'}}>
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
                        backgroundColor: '#B09574'
                    }}>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> {usuario.email}</p>
                        <p><strong>Código Postal:</strong> {usuario.codigoPostal}</p>
                    </div>
                )}
                <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />

                {/* Mis Mascotas en Adopción */}
                <h3>🐶 Mis Animalitos en Adopción</h3>
                {misAdopciones.length === 0 ? (
                    <p style={{ color: '#666' }}>No tienes mascotas en adopción publicadas.</p>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {misAdopciones.map((animal) => (
                            <div className="tarjeta" key={animal.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', minWidth: '200px', maxWidth: '250px' }}>
                                <img
                                    src={animal.fotoUrl ? `http://localhost:8080${animal.fotoUrl}` : 'https://via.placeholder.com/150'}
                                    alt={`Foto de ${animal.nombre}`}
                                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                                />
                                <h3 style={{ margin: '5px 0' }}>{animal.nombre}</h3>
                                <p style={{ margin: '5px 0' }}><strong>Especie:</strong> {animal.especie}</p>
                                <p style={{ margin: '5px 0' }}><strong>Raza:</strong> {animal.raza || 'Mestizo'}</p>
                                <p style={{ margin: '5px 0' }}><strong>CP:</strong> {animal.codigoPostal}</p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Estado:</strong>{' '}
                                    <span style={{ color: animal.estado === 'ADOPTADO' ? 'green' : 'orange' }}>
                                        {animal.estado}
                                    </span>
                                </p>
                                <button
                                    onClick={() => navigate(`/animales/${animal.id}`)}
                                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />

                {/* Mis Reportes de Extravío */}
                <h3>🔎 Mis Mascotas Extraviadas</h3>
                {misPerdidas.length === 0 ? (
                    <p style={{ color: '#666' }}>No tienes reportes de extravío activos.</p>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {misPerdidas.map((mascota) => (
                            <div className="tarjeta" key={mascota.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', minWidth: '200px', maxWidth: '250px' }}>
                                <img
                                    src={mascota.imagenUrl ? `http://localhost:8080${mascota.imagenUrl}` : 'https://via.placeholder.com/180'}
                                    alt={`Foto de ${mascota.nombre}`}
                                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                                />
                                <h3 style={{ margin: '5px 0' }}>{mascota.nombre}</h3>
                                <p style={{ margin: '5px 0' }}><strong>Especie:</strong> {mascota.especie}</p>
                                <p style={{ margin: '5px 0' }}><strong>Raza:</strong> {mascota.raza || 'Mestizo'}</p>
                                <p style={{ margin: '5px 0' }}><strong>Zona:</strong> {mascota.zonaDesaparicion}</p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Estado:</strong>{' '}
                                    <span style={{ color: mascota.encontrada ? 'green' : 'orange' }}>
                                        {mascota.encontrada ? 'RESCATADA / ENCONTRADA' : 'EXTRAVIADA'}
                                    </span>
                                </p>
                                <button
                                    onClick={() => navigate(`/mascotas-desaparecidas/${mascota.id}`)}
                                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Perfil;