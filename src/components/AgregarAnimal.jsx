import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgregarAnimal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        especie: 'Perro',
        raza: '',
        descripcion: '',
        fotoUrl: '',
        codigoPostal: ''
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
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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

        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/animales/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('¡Mascota agregada con éxito!');
                navigate('/buscar');
            } else {
                const data = await response.json();
                setError(data.error || 'Error al guardar la mascota');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {/* ESTE ES EL HEADER QUE AGREGUÉ */}
            <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <h1>🐾 Adopta un Perrito</h1>
                <nav>
                    <button onClick={() => navigate('/home')}>Home</button> |
                    <button onClick={() => navigate('/perfil')} style={{ marginLeft: '10px' }}>Ver Mi Perfil</button> |
                    <button onClick={() => navigate('/buscar')} style={{ marginLeft: '10px' }}>Buscar Mascotas</button> |
                    <button onClick={handleLogout} style={{ marginLeft: '10px', color: 'red' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            {/* AQUÍ COMIENZA TU FORMULARIO ORIGINAL */}
            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h2 style={{ marginTop: '20px' }}>Agregar Nueva Mascota</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
                    <select name="especie" onChange={handleChange}>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                    </select>
                    <input name="raza" placeholder="Raza" onChange={handleChange} />
                    <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
                    <input name="fotoUrl" placeholder="URL de la Foto" onChange={handleChange} />
                    <input name="codigoPostal" placeholder="Código Postal" onChange={handleChange} required />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Mascota'}
                    </button>
                    <button type="button" onClick={() => navigate('/home')}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarAnimal;