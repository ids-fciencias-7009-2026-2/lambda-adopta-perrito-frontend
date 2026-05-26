import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const MisMascotas = () => {
    const navigate = useNavigate();

    // Estados para almacenar las publicaciones del usuario
    const [adopciones, setAdopciones] = useState([]);
    const [perdidas, setPerdidas] = useState([]);

    // Estados de control de la vista
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        // Verifica que exista una sesión activa antes de intentar cargar la vista
        if (!token) {
            navigate('/login');
            return;
        }

        // Recupera ambas listas de publicaciones (Adopciones y Extravíos) en paralelo
        const fetchMisPublicaciones = async () => {
            try {
                // 1. Petición para mascotas en adopción
                const resAdopciones = await fetch(`http://localhost:8080/animales/mis-publicaciones`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 2. Petición para mascotas perdidas
                const resPerdidas = await fetch(`http://localhost:8080/mascotas-desaparecidas/mis-publicaciones`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (resAdopciones.ok) {
                    setAdopciones(await resAdopciones.json());
                }

                if (resPerdidas.ok) {
                    setPerdidas(await resPerdidas.json());
                }

            } catch (err) {
                setError('Error al conectar con el servidor para cargar tus publicaciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchMisPublicaciones();
    }, [navigate]);

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <Navbar />

            <main style={{ padding: '30px', textAlign: 'center' }}>

                {/* Sección de adopción */}
                <h1 style={{ color: '#9C27B0' }}>🐕 Mis Mascotas en Adopción</h1>

                {/* Botón para agregar nueva adopción */}
                <button
                    onClick={() => navigate('/agregar-animal')}
                    style={{ width: '100%', maxWidth: '600px', backgroundColor: '#4CAF50', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', margin: '20px auto', display: 'block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                    ➕ Agregar Nueva Mascota para Adopción
                </button>

                {/* Manejo de carga y errores */}
                {loading && <p>Cargando tus mascotas en adopción...</p>}
                {error && <p style={{color:'red'}}>{error}</p>}
                {!loading && adopciones.length === 0 && <p style={{ color: '#888' }}>No tienes mascotas en adopción.</p>}

                {/* Grid de tarjetas con el mismo estilo de BuscarMascotas */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {adopciones.map((animal) => (
                        <div key={animal.id} style={{ border: '1px solid #ddd', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', minWidth: '250px', maxWidth: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            {animal.fotoUrl && (
                                <img src={`http://localhost:8080${animal.fotoUrl}`} alt={animal.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <h3 style={{ margin: '5px 0', fontSize: '1.4rem' }}>{animal.nombre}</h3>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Especie:</strong> {animal.especie}</p>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Raza:</strong> {animal.raza || 'Mestizo'}</p>
                            <p style={{ margin: '5px 0' }}>
                                <strong>Estado:</strong>{' '}
                                <span style={{ color: animal.estado === 'ADOPTADO' ? 'green' : '#FF9800', fontWeight: 'bold' }}>
                                    {animal.estado}
                                </span>
                            </p>

                            {/* Botón único que dirige a la vista de detalles y edición */}
                            <button
                                onClick={() => navigate(`/animales/${animal.id}`)}
                                style={{ width: '100%', marginTop: '15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                👁️ Ver Detalles y Opciones
                            </button>
                        </div>
                    ))}
                </div>


                {/* Sección de perdidas */}
                <hr style={{ margin: '60px 0', borderColor: '#eee' }} />
                <h1 style={{ color: '#F44336' }}>🔍 Mis Mascotas Perdidas</h1>

                {/* Botón para reportar mascota extraviada */}
                <button
                    onClick={() => navigate('/agregar-perdida')}
                    style={{ width: '100%', maxWidth: '600px', backgroundColor: '#4CAF50', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', margin: '20px auto', display: 'block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                    ➕ Reportar Mascota Perdida
                </button>

                {/* Manejo de carga de mascotas perdidas */}
                {!loading && perdidas.length === 0 && (
                    <p style={{ color: '#888' }}>No tienes reportes de mascotas extraviadas.</p>
                )}

                {/* Grid de tarjetas de perdidas (Mismo diseño que adopciones) */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {perdidas.map((mascota) => (
                        <div key={mascota.id} style={{ border: '1px solid #ddd', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', minWidth: '250px', maxWidth: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            {mascota.imagenUrl && (
                                <img src={`http://localhost:8080${mascota.imagenUrl}`} alt={mascota.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <h3 style={{ margin: '5px 0', fontSize: '1.4rem' }}>{mascota.nombre}</h3>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Especie:</strong> {mascota.especie}</p>
                            <p style={{ margin: '5px 0', color: '#555' }}><strong>Zona:</strong> {mascota.zonaDesaparicion}</p>
                            <p style={{ margin: '5px 0' }}>
                                <strong>Estado:</strong>{' '}
                                <span style={{ color: mascota.encontrada ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {mascota.encontrada ? 'ENCONTRADA' : 'EXTRAVIADA'}
                                </span>
                            </p>

                            {/* Botón único que dirigirá a la vista de detalles y edición (Próximo paso) */}
                            <button
                                onClick={() => alert('Próximamente: Vista de detalle de perdidas para editar/encontrar')}
                                style={{ width: '100%', marginTop: '15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                👁️ Ver Detalles y Opciones
                            </button>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default MisMascotas;