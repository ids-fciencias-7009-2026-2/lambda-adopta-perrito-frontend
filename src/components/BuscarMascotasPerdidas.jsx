import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BuscarMascotasPerdidas = () => {
    const navigate = useNavigate();
    const [mascotas, setMascotas] = useState([]);
    const [zona, setZona] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    // Función para traer todas las mascotas desaparecidas activas
    const fetchTodas = useCallback(async () => {
        setError('');
        setLoading(true);
        setBusquedaRealizada(true);
        try {
            const response = await fetch('http://localhost:8080/mascotas-desaparecidas');
            if (response.ok) {
                const data = await response.json();
                setMascotas(data);
            } else {
                setError('Ocurrió un error al cargar las mascotas desaparecidas.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Proteger la vista: si no hay token va a login, si sí hay, carga los datos
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTodas();
        }
    }, [navigate, fetchTodas]);

    // Función para manejar el logout idéntica a la de tus compañeros
    const handleLogout = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/usuarios/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        } finally {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('rol');
            navigate('/login');
        }
    };

    // Función para filtrar por Zona pegándole al endpoint de Geovanni
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!zona.trim()) {
            fetchTodas();
            return;
        }

        setError('');
        setLoading(true);
        setBusquedaRealizada(true);

        try {
            const response = await fetch(`http://localhost:8080/mascotas-desaparecidas/buscar?zona=${encodeURIComponent(zona)}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                // Si viene un objeto directo en lugar de arreglo, lo metemos en uno
                setMascotas(Array.isArray(data) ? data : [data]);
            } else if (response.status === 404) {
                setMascotas([]);
            } else {
                setError('Ocurrió un error al buscar por zona.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {/* Header consistente con el diseño del equipo */}
            <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h1>🐾 Mascotas Desaparecidas</h1>
                <nav>
                    <button onClick={() => navigate('/home')}>Home</button> |
                    <button onClick={() => navigate('/buscar')} style={{ marginLeft: '10px' }}>Ver Adopciones</button> |
                    <button onClick={() => navigate('/reportar-extravio')} style={{ marginLeft: '10px' }}>Reportar Extravío</button> |
                    <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            <main style={{ marginTop: '30px' }}>
                <h2>Buscar por Zona o Alcaldía</h2>

                <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Ej. Coyoacán, Copilco..."
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        style={{ padding: '8px', width: '250px' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

                {busquedaRealizada && !loading && mascotas.length === 0 && !error && (
                    <p style={{ marginTop: '30px', color: '#666' }}>
                        No hay reportes de mascotas extraviadas en esta zona.
                    </p>
                )}

                {/* Grid de Tarjetas adaptado al DTO de MascotaDesaparecida */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                    {mascotas.map((mascota) => (
                        <div key={mascota.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', minWidth: '200px', maxWidth: '250px' }}>
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
            </main>
        </div>
    );
};

export default BuscarMascotasPerdidas;