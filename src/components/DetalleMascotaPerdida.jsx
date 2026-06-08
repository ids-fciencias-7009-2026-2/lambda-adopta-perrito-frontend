import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetalleMascotaPerdida = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [marcandoEncontrada, setMarcandoEncontrada] = useState(false);
    const esAdmin = sessionStorage.getItem('rol') === 'ADMIN';

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchMascota = async () => {
            try {
                const response = await fetch(`http://localhost:8080/mascotas-desaparecidas/${id}`);

                if (response.ok) {
                    const data = await response.json();
                    setMascota(data);
                } else if (response.status === 404) {
                    setError('No se encontró el reporte de esta mascota.');
                } else {
                    setError('Ocurrió un error al cargar el detalle de la mascota.');
                }
            } catch (err) {
                setError('No se pudo conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchMascota();
    }, [id, navigate]);

    const handleMarcarEncontrada = async () => {
        if (!window.confirm('¿Seguro que deseas marcar esta mascota como encontrada? El reporte se cerrará.')) {
            return;
        }

        setMarcandoEncontrada(true);
        try {
            const response = await fetch(`http://localhost:8080/mascotas-desaparecidas/${id}/encontrada`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert('¡Excelente noticia! La mascota fue marcada como encontrada.');
                navigate('/mascotas-desaparecidas');
            } else {
                alert('No se pudo actualizar el estado de la mascota.');
            }
        } catch (err) {
            alert('Error de conexión con el servidor.');
        } finally {
            setMarcandoEncontrada(false);
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando detalles de la mascota...</div>;
    if (error) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!mascota) return null;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <button className="btn-principal" onClick={() => navigate('/mascotas-desaparecidas')} style={{ marginBottom: '20px', cursor: 'pointer', fontSize: '1rem' }}>
                ← Volver a la galería
            </button>
            <div style={{ clear: 'both' }}></div>

            <h1 style={{ color: '#f44336', lineHeight:'1'}}>🚨 Mascota Extraviada: <br />{
                mascota.nombre}</h1>

            <img
                src={mascota.imagenUrl ? `http://localhost:8080${mascota.imagenUrl}` : 'https://via.placeholder.com/300'}
                alt={`Foto de ${mascota.nombre}`}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', margin: '20px 0' }}
            />

            <div style={{ textAlign: 'center', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', lineHeight: '1.6' }}>
                <p><strong>Especie:</strong> {mascota.especie}</p>
                <p><strong>Raza:</strong> {mascota.raza || 'Mestizo / No especificada'}</p>
                <p><strong>Edad aproximada:</strong> {mascota.edad !== null ? `${mascota.edad} años` : 'No especificada'}</p>
                <p><strong>Color / Rasgos:</strong> {mascota.color || 'No especificado'}</p>
                <p><strong>Zona de desaparición:</strong> {mascota.zonaDesaparicion}</p>
                <p><strong>Fecha en que se extravió:</strong> {mascota.fechaDesaparicion}</p>
                <p><strong>Descripción de la situación:</strong></p>
                <p style={{ fontStyle: 'italic', color: '#555', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #eee' }}>
                    {mascota.descripcion || 'Sin descripción adicional.'}
                </p>
                <p>
                    <strong>Estado actual del reporte:</strong>{' '}
                    <span style={{ color: mascota.encontrada ? 'green' : 'orange', fontWeight: 'bold' }}>
                        {mascota.encontrada ? '🟢 ENCONTRADA / RESCATADA' : '🔴 EXTRAVIADA (ACTIVO)'}
                    </span>
                </p>
            </div>

            {/* Sección de acciones dinámicas según requerimientos */}
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Botón para contactar al dueño que utiliza el número telefónico del DTO */}
                {!mascota.encontrada && (
                    <a
                        href={`https://wa.me/${mascota.telefonoContacto.replace(/\s+/g, '')}?text=Hola,%20vi%20tu%20publicación%20sobre%20${encodeURIComponent(mascota.nombre)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: 'none',
                            backgroundColor: '#25D366',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            display: 'block',
                            cursor: 'pointer'
                        }}
                    >
                        📞 Contactar al dueño (WhatsApp / Tel: {mascota.telefonoContacto})
                    </a>
                )}

                {/* Acción exclusiva del Administrador para cerrar el reporte si ya apareció */}
                {esAdmin && !mascota.encontrada && (
                    <button
                        onClick={handleMarcarEncontrada}
                        disabled={marcandoEncontrada}
                        style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', marginTop: '10px' }}
                    >
                        {marcandoEncontrada ? 'Actualizando...' : 'Marcar como Encontrada'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetalleMascotaPerdida;