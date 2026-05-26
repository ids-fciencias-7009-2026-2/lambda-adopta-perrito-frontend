import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar'; // Importamos el Navbar

const DetalleAnimal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const idUsuarioActual = parseInt(sessionStorage.getItem('idUsuario'));
    const [correoContacto, setCorreoContacto] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return navigate('/login');

        const fetchAnimal = async () => {
            try {
                const response = await fetch(`http://localhost:8080/animales/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) setAnimal(await response.json());
                else setError('No se encontró la mascota.');
            } catch (err) {
                setError('No se pudo conectar con el servidor.');
            } finally { setLoading(false); }
        };

        fetchAnimal();
    }, [id, navigate]);

    const handleEliminar = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) return;
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/animales/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) navigate('/mis-mascotas');
            else setError('No se pudo eliminar.');
        } catch (err) { setError('Error de conexión.'); }
    };

    // Ahora este botón invierte el estado
    const handleToggleAdoptar = async () => {
        const mensaje = animal.estado === 'ADOPTADO'
            ? '¿Quieres volver a marcar a esta mascota como DISPONIBLE?'
            : '¿Confirmas que esta mascota ya fue ADOPTADA?';

        if (!window.confirm(mensaje)) return;

        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/animales/${id}/adoptar`, {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) setAnimal(await response.json());
            else setError('No se pudo actualizar el estado.');
        } catch (err) { setError('Error de conexión.'); }
    };

    const handleInteres = async () => {
        const token = sessionStorage.getItem('token');
        try {
            // CAMBIO: Usamos la ruta /contacto y el m�todo GET
            const response = await fetch(`http://localhost:8080/animales/${id}/contacto`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                setCorreoContacto(data.correo || data.email);
                alert('�Solicitud enviada! El sistema ha registrado tu inter�s.');
            } else {
                setError('El servidor rechaz� la solicitud (Error ' + response.status + ')');
            }
        } catch (err) {

            setError('No se pudo conectar con el servidor. Verifica que Spring Boot est� corriendo.');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</p>;

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <Navbar /> {/* NAVBAR AGREGADO A LA VISTA */}

            <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '5px' }}>
                    ← Regresar
                </button>

                {animal.fotoUrl && (
                    <img src={`http://localhost:8080${animal.fotoUrl}`} alt={animal.nombre} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
                )}

                <h2 style={{ fontSize: '2rem', margin: '10px 0' }}>{animal.nombre}</h2>
                <p><strong>Especie:</strong> {animal.especie} | <strong>Raza:</strong> {animal.raza || 'Mestizo'}</p>
                <p><strong>Código Postal:</strong> {animal.codigoPostal}</p>
                <p><strong>Descripción:</strong> {animal.descripcion || 'Sin descripción'}</p>
                <p style={{ fontSize: '1.2rem', margin: '15px 0' }}>
                    <strong>Estado actual:</strong>{' '}
                    <span style={{ color: animal.estado === 'ADOPTADO' ? 'green' : 'orange', fontWeight: 'bold' }}>
                        {animal.estado}
                    </span>
                </p>

                {/* BOTONES DE ADMINISTRACIÓN (SOLO PARA EL DUEÑO) */}
                {animal.idUsuario === idUsuarioActual && (
                    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', borderTop: '2px dashed #eee' }}>
                        <h3>⚙️ Opciones de mi publicación</h3>

                        <button onClick={handleToggleAdoptar} style={{ backgroundColor: animal.estado === 'ADOPTADO' ? '#757575' : '#2196F3', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
                            {animal.estado === 'ADOPTADO' ? '↩️ Desmarcar como Adoptado' : '✅ Marcar como Adoptado'}
                        </button>

                        <button onClick={() => navigate(`/animales/${id}/editar`)} style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
                            ✏️ Editar Datos
                        </button>

                        <button onClick={handleEliminar} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
                            🗑️ Eliminar Publicación
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalleAnimal;