import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getAvatarColor, getAvatarLetter, getAvatarSrc } from '../utils/avatarHelper';
export default function CommunityNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất');
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                <div style={styles.logo} onClick={() => navigate('/')}>
                    🦐 AquaMonitor
                </div>
                <div style={styles.links}>
                    <span style={styles.link} onClick={() => navigate('/community')}>
                        Cộng đồng
                    </span>
                    {user && (
                        <span style={styles.link} onClick={() => navigate('/ponds')}>
                            Dashboard
                        </span>
                    )}
                </div>
                <div style={styles.right}>
                    {user ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <button
                                style={styles.loginBtn}
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </button>
                            <button
                                style={styles.registerBtn}
                                onClick={() => navigate('/register')}
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: '#185FA5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    inner: {
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 20px', height: '56px',
        display: 'flex', alignItems: 'center', gap: '20px'
    },
    logo: {
        fontSize: '17px', fontWeight: '700',
        color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap'
    },
    links: { display: 'flex', gap: '4px', flex: 1 },
    link: {
        fontSize: '13px', color: 'rgba(255,255,255,0.85)',
        padding: '5px 12px', borderRadius: '6px',
        cursor: 'pointer', fontWeight: '500'
    },
    right: { display: 'flex', gap: '8px', alignItems: 'center' },
    username: { fontSize: '13px', color: 'rgba(255,255,255,0.85)' },
    logoutBtn: {
        padding: '5px 12px',
        background: 'rgba(255,255,255,0.15)',
        color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
    },
    loginBtn: {
        padding: '5px 14px', background: 'transparent',
        color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
    },
    registerBtn: {
        padding: '5px 14px', background: '#fff',
        color: '#185FA5', border: 'none',
        borderRadius: '6px', fontSize: '12px',
        fontWeight: '500', cursor: 'pointer'
    }
};