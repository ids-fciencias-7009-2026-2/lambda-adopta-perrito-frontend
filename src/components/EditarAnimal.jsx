import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    descripcion: '',
    fotoUrl: '',
    codigoPostal: ''
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // cargamos los datos actuales del animal al montar
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
          setFormData({
            nombre: data.nombre || '',
            especie: data.especie || 'Perro',
            raza: data.raza || '',
            descripcion: data.descripcion || '',
            fotoUrl: data.fotoUrl || '',
            codigoPostal: data.codigoPostal || ''
          });
        } else {
          setError('No se encontró la mascota.');
        }
      } catch (err) {
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/animales/${id}/editar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('¡Mascota actualizada con éxito!');
        navigate(`/animales/${id}`);
      } else if (response.status === 403) {
        setError('No tienes permisos para editar esta mascota.');
      } else if (response.status === 404) {
        setError('La mascota no fue encontrada.');
      } else {
        setError('Ocurrió un error al guardar los cambios.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</p>;

  return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <h1>🐾 Adopta un Perrito</h1>
          <nav>
            <button onClick={() => navigate('/home')}>Home</button> |
            <button onClick={() => navigate('/buscar')} style={{ marginLeft: '10px' }}>Buscar Mascotas</button> |
            <button onClick={() => navigate(`/animales/${id}`)} style={{ marginLeft: '10px' }}>Ver Detalle</button>
          </nav>
        </header>

        <div style={{ maxWidth: '500px', margin: '30px auto' }}>
          <h2>Editar Mascota</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
            />
            <select name="especie" value={formData.especie} onChange={handleChange}>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </select>
            <input
                name="raza"
                placeholder="Raza"
                value={formData.raza}
                onChange={handleChange}
            />
            <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
            />
            <input
                name="fotoUrl"
                placeholder="URL de la Foto"
                value={formData.fotoUrl}
                onChange={handleChange}
            />
            <input
                name="codigoPostal"
                placeholder="Código Postal"
                value={formData.codigoPostal}
                onChange={handleChange}
                required
            />

            <button
                type="submit"
                disabled={guardando}
                style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
            >
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
                type="button"
                onClick={() => navigate(`/animales/${id}`)}
                style={{ padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
  );
};

export default EditarAnimal;