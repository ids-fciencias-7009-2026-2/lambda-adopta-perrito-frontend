import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const BuscarMascotas = () => {
    const navigate = useNavigate();
    const [animales, setAnimales] = useState([]);
    const [especie, setEspecie] = useState('');
    const [raza, setRaza] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const performSearch = useCallback(async () => {
        setError('');
        setLoading(true);
        setBusquedaRealizada(true);

        const token = sessionStorage.getItem('token');
        const params = new URLSearchParams();
        if (especie) params.append('especie', especie);
        if (raza) params.append('raza', raza);
        if (codigoPostal) params.append('cp', codigoPostal);

        try {
            const response = await fetch(`http://localhost:8080/animales/buscar?${params.toString()}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAnimales(data);
            } else if (response.status === 404) {
                setAnimales([]);
            } else {
                setError('Ocurrió un error al buscar las mascotas.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    }, [especie, raza, codigoPostal]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) navigate('/login');
        else performSearch();
    }, [navigate, performSearch]);

    const handleLogout = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/usuarios/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } finally {
            sessionStorage.clear();
            navigate('/login');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Navbar />

            <main style={{ marginTop: '30px' }}>
                <h2>Buscar Mascota</h2>

                <form onSubmit={(e) => { e.preventDefault(); performSearch(); }} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <select value={especie} onChange={(e) => setEspecie(e.target.value)} style={{ padding: '8px' }}>
                        <option value="">Todas las especies</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                    </select>
                    <input type="text" placeholder="Raza (ej. Labrador)" value={raza} onChange={(e) => setRaza(e.target.value)} style={{ padding: '8px' }} />
                    <input type="text" placeholder="Código Postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} style={{ padding: '8px' }} />
                    <button type="submit" disabled={loading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
                {busquedaRealizada && !loading && animales.length === 0 && !error && (
                    <p style={{ marginTop: '30px', color: '#666' }}>No hay mascotas que coincidan con los filtros actuales.</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                    {animales.map((animal) => (
                        <div key={animal.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', minWidth: '200px', maxWidth: '250px' }}>
                            {animal.fotoUrl && (
                                <img src={`http://localhost:8080${animal.fotoUrl}`} alt={animal.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <h3 style={{ margin: '5px 0' }}>{animal.nombre}</h3>
                            <p style={{ margin: '5px 0' }}><strong>Especie:</strong> {animal.especie}</p>
                            <p style={{ margin: '5px 0' }}><strong>CP:</strong> {animal.codigoPostal}</p>
                            <p style={{ margin: '5px 0' }}><strong>Estado:</strong>{' '}
                                <span style={{ color: animal.estado === 'ADOPTADO' ? 'green' : 'orange' }}>{animal.estado}</span>
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
            </main>
        </div>
    );
};

export default BuscarMascotas;