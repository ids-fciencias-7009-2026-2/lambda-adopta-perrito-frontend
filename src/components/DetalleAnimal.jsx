import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetalleAnimal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const esAdmin = sessionStorage.getItem('rol') === 'ADMIN';

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAnimal = async () => {
            try {
                const response = await fetch(`http://localhost:8080/animales/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAnimal(data);
                } else if (response.status === 404) {
                    setError('No se encontró la mascota.');
                } else {
                    setError('Ocurrió un error al cargar la mascota.');
                }
            } catch (err) {
                setError('No se pudo conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [id, navigate]);

    const handleEliminar = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) return;

        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/animales/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                navigate('/buscar');
            } else {
                setError('No se pudo eliminar la mascota.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        }
    };

    const handleAdoptar = async () => {
        if (!window.confirm('¿Confirmas que esta mascota fue adoptada?')) return;

        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/animales/${id}/adoptar`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const actualizado = await response.json();
                setAnimal(actualizado);
            } else {
                setError('No se pudo marcar la mascota como adoptada.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '20px' }}>
            <button onClick={() => navigate('/buscar')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ← Volver a búsqueda
            </button>

            {animal.fotoUrl && (
                <img
                    src={animal.fotoUrl}
                    alt={`Foto de ${animal.nombre}`}
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
                />
            )}

            <h2>{animal.nombre}</h2>
            <p><strong>Especie:</strong> {animal.especie}</p>
            <p><strong>Raza:</strong> {animal.raza || 'Mestizo'}</p>
            <p><strong>Código Postal:</strong> {animal.codigoPostal}</p>
            <p><strong>Descripción:</strong> {animal.descripcion || 'Sin descripción'}</p>
            <p>
                <strong>Estado:</strong>{' '}
                <span style={{ color: animal.estado === 'ADOPTADO' ? 'green' : 'orange' }}>
                    {animal.estado}
                </span>
            </p>

            {/* --- SECCIÓN DEL MAPA (Añadida) --- */}
            {animal.codigoPostal && (
                <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Ubicación Aproximada</h3>
                    <iframe
                        title="Mapa de ubicación"
                        width="100%"
                        height="250"
                        style={{ border: 0, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        loading="lazy"
                        allowFullScreen
                        // Aquí usamos el código postal para buscar en el mapa
                        src={`https://maps.google.com/maps?q=${animal.codigoPostal}&output=embed`}
                    ></iframe>
                </div>
            )}

            {esAdmin && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {animal.estado !== 'ADOPTADO' && (
                        <button
                            onClick={handleAdoptar}
                            style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Marcar como Adoptado
                        </button>
                    )}
                    <button
                        onClick={handleEliminar}
                        style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                        Eliminar Mascota
                    </button>
                </div>
            )}
        </div>
    );
};

export default DetalleAnimal;