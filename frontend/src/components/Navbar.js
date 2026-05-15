import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getAvatarColor, getAvatarLetter, getAvatarSrc } from '../utils/avatarHelper';
import { motion } from 'framer-motion'; // Import motion

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Đã đăng xuất');
        navigate('/login');
    };

    return (
        <motion.nav 
            initial={{ y: -70 }} // Khi load trang, Navbar trượt từ trên xuống
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.nav}
        >
            <div style={styles.left}>
                <motion.div 
                    style={styles.logo} 
                    onClick={() => navigate('/ponds')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span style={styles.logoEmoji}>🦐</span>
                    <span style={styles.logoText}>AquaMonitor</span>
                </motion.div>

                <div style={styles.navLinks}>
                    <motion.span 
                        style={styles.navLink} 
                        onClick={() => navigate('/community')}
                        whileHover={{ 
                            color: '#fff', 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)' 
                        }}
                    >
                        Cộng đồng
                    </motion.span>
                </div>
            </div>
            
            <div style={styles.right}>
                {user?.role === 'ADMIN' && (
                    <motion.span 
                        style={styles.adminBadge} 
                        onClick={() => navigate('/admin')}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(252, 211, 77, 0.2)' }}
                    >
                        👑 Admin
                    </motion.span>
                )}

                <motion.div 
                    style={styles.userSection} 
                    onClick={() => navigate('/profile')}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(56, 189, 248, 0.4)' }}
                >
                    {getAvatarSrc(user) ? (
                        <img src={getAvatarSrc(user)} alt="avatar" style={styles.avatarImg} />
                    ) : (
                        <div style={{ ...styles.avatarDefault, background: getAvatarColor(user?.username) }}>
                            {getAvatarLetter(user)}
                        </div>
                    )}
                    <span style={styles.userName}>{user?.username}</span>
                </motion.div>
              
                <motion.button 
                    style={styles.logoutBtn} 
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05, borderColor: '#ef4444', color: '#ef4444' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Đăng xuất
                </motion.button>
            </div>
        </motion.nav>
    );
}

const styles = {
nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: '70px',
        
        // 1. Đảm bảo sát mép tuyệt đối
        position: 'fixed', // Hoặc 'sticky' nếu bạn muốn nó đi theo khi cuộn
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        boxSizing: 'border-box', // Quan trọng để padding không làm tràn chiều rộng

        // 2. Hiệu ứng màu sắc Dark Mode & Glassmorphism
        background: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(12px)',
        
        // 3. Đường kẻ Neon mỏng dưới Navbar để tạo điểm nhấn
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
    logoEmoji: { fontSize: '24px' },
    logoText: {
        fontSize: '20px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        // Đổ màu gradient cho text giống với các nút bấm chính (Sky Blue)
        background: 'linear-gradient(135deg, #38bdf8 0%, #fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
navLink: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        // Khi hover bạn có thể dùng state để đổi sang màu trắng và đổ bóng
    },
    navLink: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#94a3b8', // Màu xám nhạt giống subtitle
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#fff',
            background: 'rgba(255, 255, 255, 0.05)'
        }
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    adminBadge: {
        fontSize: '12px',
        padding: '6px 14px',
        background: 'rgba(252, 211, 77, 0.1)', // Vàng nhạt trong suốt
        color: '#fbbf24',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '700',
        border: '1px solid rgba(252, 211, 77, 0.2)',
    },
userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 14px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'border 0.3s ease',
    },
    avatarImg: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #38bdf8' // Viền xanh sky cho đồng bộ
    },
    avatarDefault: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
        border: '2px solid rgba(255, 255, 255, 0.2)'
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#f8fafc'
    },
logoutBtn: {
        padding: '8px 16px',
        background: 'transparent',
        color: '#ef4444', // Màu đỏ nhẹ cho nút đăng xuất
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};