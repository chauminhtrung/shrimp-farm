import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getAvatarColor, getAvatarLetter, getAvatarSrc } from '../utils/avatarHelper';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo} onClick={() => navigate('/ponds')}>
                🦐 AquaMonitor
            </div>
            <span
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)',
                        cursor: 'pointer', padding: '5px 10px' }}
                onClick={() => navigate('/community')}
            >
                Cộng đồng
            </span>
            
            <div style={styles.right}>
           

{getAvatarSrc(user) ? (
    <img
        src={getAvatarSrc(user)}
        alt="avatar"
        style={{
            width: '30px', height: '30px',
            borderRadius: '50%', objectFit: 'cover',
            cursor: 'pointer', border: '2px solid rgba(255,255,255,0.5)'
        }}
        onClick={() => navigate('/profile')}
    />
) : (
    <div
        style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: getAvatarColor(user?.username),
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer'
        }}
        onClick={() => navigate('/profile')}
    >
        {getAvatarLetter(user)}
    </div>
)}
              
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '56px',
        background: '#185FA5',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    logo: {
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '-0.3px'
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    username: {
        fontSize: '13px',
        opacity: 0.9
    },
    logoutBtn: {
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer'
    }
};