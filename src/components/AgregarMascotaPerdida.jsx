import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AgregarMascotaPerdida = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '', especie: 'Perro', raza: '', edad: '', color: '', descripcion: '',
        zonaDesaparicion: '', fechaDesaparicion: '', telefonoContacto: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const token = sessionStorage.getItem('token');

        // Formateamos los datos para enviarlos como JSON según el DTO del backend
        const payload = {
            ...formData,
            edad: formData.edad ? parseInt(formData.edad) : null,
        };

        try {
            const response = await fetch('http://localhost:8080/mascotas-desaparecidas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('¡Mascota reportada con éxito!');
                navigate('/mis-mascotas');
            } else {
                setError('Error al guardar el reporte');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h2 style={{ marginTop: '20px', color: '#F44336', textAlign: 'center' }}>🚨 Reportar Mascota Extraviada</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                    <input name="nombre" placeholder="Nombre de la mascota" onChange={handleChange} required style={{ padding: '10px' }} />
                    <select name="especie" onChange={handleChange} style={{ padding: '10px' }}>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <input name="raza" placeholder="Raza (Opcional)" onChange={handleChange} style={{ padding: '10px' }} />
                    <input name="color" placeholder="Color distintivo" onChange={handleChange} style={{ padding: '10px' }} />
                    <textarea name="descripcion" placeholder="Descripción física o señas particulares" onChange={handleChange} rows="3" style={{ padding: '10px' }} />

                    <input name="zonaDesaparicion" placeholder="Zona donde se extravió (Ej. Parque Central)" onChange={handleChange} required style={{ padding: '10px' }} />
                    <label style={{ fontSize: '14px', color: '#555' }}>Fecha de Desaparición:</label>
                    <input type="date" name="fechaDesaparicion" onChange={handleChange} required style={{ padding: '10px' }} />
                    <input name="telefonoContacto" placeholder="Teléfono de contacto" onChange={handleChange} required style={{ padding: '10px' }} />

                    <button type="submit" disabled={loading} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                        {loading ? 'Guardando Reporte...' : 'Publicar Reporte'}
                    </button>
                    <button type="button" onClick={() => navigate('/mis-mascotas')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '8px' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgregarMascotaPerdida;