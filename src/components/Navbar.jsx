import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/usuarios/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error al cerrar sesión', err);
        } finally {
            sessionStorage.clear();
            navigate('/login');
        }
    };

    return (
        <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '15px 20px', borderBottom: '1px solid #eee', backgroundColor: '#fff',
            flexWrap: 'wrap', gap: '15px'
        }}>
            <h2 onClick={() => navigate('/home')} style={{ margin: 0, cursor: 'pointer', color: '#333' }}>
                🐾 AdoptaPerrito
            </h2>
            <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/perfil')} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    👤 Mi Perfil
                </button>
                <button onClick={() => navigate('/mis-mascotas')} style={{ backgroundColor: '#9C27B0', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🐕 Mis Mascotas
                </button>
                <button onClick={() => navigate('/adoptar')} style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🏡 Adoptar
                </button>
                <button onClick={() => navigate('/perdidas')} style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🔍 Mascotas Perdidas
                </button>
                <button onClick={handleLogout} style={{ backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ccc', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cerrar Sesión
                </button>
            </nav>
        </header>
    );
};

export default Navbar;