import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportarExtravio = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        especie: 'Perro',
        raza: '',
        edad: '',
        color: '',
        descripcion: '',
        zonaDesaparicion: '',
        fechaDesaparicion: '',
        telefonoContacto: '',
        imagenUrl: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        
        const payload = {
            ...formData,
            edad: formData.edad ? parseInt(formData.edad) : null,
            raza: formData.raza || null,
            descripcion: formData.descripcion || null,
            color: formData.color || null,
            imagenUrl: formData.imagenUrl || null
        };

        try {
            
            const response = await fetch('http://localhost:8080/mascotas-desaparecidas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('¡Reporte de extravío creado con éxito!');
                navigate('/mascotas-desaparecidas'); 
            } else {
                setError('Ocurrió un error al procesar el reporte en el servidor.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h1>🐾 Mascotas Desaparecidas</h1>
                <nav>
                    <button onClick={() => navigate('/home')}>Home</button> |
                    <button onClick={() => navigate('/mascotas-desaparecidas')} style={{ marginLeft: '10px' }}>Ver Mascotas Perdidas</button> |
                    <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h2 style={{ marginTop: '20px' }}>Reportar Mascota Extraviada</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input name="nombre" placeholder="Nombre de la mascota" onChange={handleChange} required style={{ padding: '8px' }} />
                    
                    <select name="especie" onChange={handleChange} style={{ padding: '8px' }}>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                    </select>

                    <input name="raza" placeholder="Raza (Opcional)" onChange={handleChange} style={{ padding: '8px' }} />
                    <input name="edad" type="number" placeholder="Edad aproximada (Opcional)" onChange={handleChange} style={{ padding: '8px' }} />
                    <input name="color" placeholder="Color / Rasgos particulares (Opcional)" onChange={handleChange} style={{ padding: '8px' }} />
                    <textarea name="descripcion" placeholder="Descripción de la situación" onChange={handleChange} rows={3} style={{ padding: '8px' }} />
                    
                    <input name="zonaDesaparicion" placeholder="¿En qué zona/alcaldía se perdió? (Ej. Coyoacán)" onChange={handleChange} required style={{ padding: '8px' }} />
                    
                    <div style={{ textAlign: 'left', fontSize: '14px', color: '#555' }}>
                        Fecha de desaparición:
                        <input name="fechaDesaparicion" type="date" onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>

                    <input name="telefonoContacto" type="tel" placeholder="Teléfono de contacto (Ej. 5512345678)" onChange={handleChange} required style={{ padding: '8px' }} />
                    <input name="imagenUrl" placeholder="URL de la foto (Opcional)" onChange={handleChange} style={{ padding: '8px' }} />

                    <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                        {loading ? 'Guardando reporte...' : 'Publicar Reporte de Extravío'}
                    </button>
                    <button type="button" onClick={() => navigate('/mascotas-desaparecidas')} style={{ padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportarExtravio;