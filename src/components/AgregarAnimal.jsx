import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgregarAnimal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        especie: 'Perro',
        raza: '',
        descripcion: '',
        codigoPostal: ''
    });
    const [imagen, setImagen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
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

        const dataToSend = new FormData();
        dataToSend.append('nombre', formData.nombre);
        dataToSend.append('especie', formData.especie);
        dataToSend.append('raza', formData.raza);
        dataToSend.append('descripcion', formData.descripcion);
        dataToSend.append('codigoPostal', formData.codigoPostal);

        // Adjuntamos el archivo (el backend deberá buscar el parámetro 'archivoImagen')
        if (imagen) {
            dataToSend.append('archivoImagen', imagen);
        }

        try {
            const response = await fetch('http://localhost:8080/animales/agregar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataToSend
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
                    <button className="btn-principal" onClick={() => navigate('/home')}>Home</button> |
                    <button className="btn-principal" onClick={() => navigate('/perfil')} style={{ marginLeft: '10px' }}>Ver Mi Perfil</button> |
                    <button className="btn-principal" onClick={() => navigate('/buscar')} style={{ marginLeft: '10px' }}>Buscar Mascotas</button> |
                    <button className="btn-principal btn-logout" onClick={handleLogout} style={{ marginLeft: '10px' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>


            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h2 style={{ marginTop: '20px' }}>Agregar Nueva Mascota</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input className="input-class" name="nombre" placeholder="Nombre" onChange={handleChange} required />
                    <select className="input-class" name="especie" onChange={handleChange}>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                    </select>
                    <input className="input-class" name="raza" placeholder="Raza" onChange={handleChange} />
                    <textarea className="input-class" name="descripcion" placeholder="Descripción" onChange={handleChange} />
                    <input className="input-class" name="codigoPostal" placeholder="Código Postal" onChange={handleChange} required />
                    Agregar Foto: <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        style={{ alignSelf: 'center' }}
                    />



                    <button className="btn-principal" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Mascota'}
                    </button>
                    <button className="btn-principal" type="button" onClick={() => navigate('/home')}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarAnimal;