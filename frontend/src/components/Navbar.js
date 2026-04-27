import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
            <div style={styles.right}>
                <span style={styles.username}>Xin chào, {user?.username}</span>
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