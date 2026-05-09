import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetalleAnimal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const esAdmin = sessionStorage.getItem('rol') === 'ADMIN';
    const [correoContacto, setCorreoContacto] = useState(''); 

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

    const handleInteres = async () => {
    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8080/api/animales/${id}/contacto`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            setCorreoContacto(data.correo); // Guardamos el correo recibido del backend
        } else {
            setError('No se pudo obtener la información de contacto.');
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
            
            {/* Sección para usuarios adoptantes (No Admins) */}
            {!esAdmin && animal.estado !== 'ADOPTADO' && (
                <div style={{ marginTop: '20px' }}>
                    {!correoContacto ? (
                        <button
                            onClick={handleInteres}
                            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '12px 20px', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', width: '100%' }}
                        >
                            🐾 Estoy Interesado
                        </button>
                    ) : (
                        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', border: '1px solid #4CAF50' }}>
                            <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
                                ¡Genial! Ponte en contacto con el dueño:
                            </p>
                            <p style={{ fontSize: '18px', marginTop: '10px' }}>{correoContacto}</p>
                        </div>
                    )}
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