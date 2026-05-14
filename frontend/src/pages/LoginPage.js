import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import bgImage from '../assets/images/login-bg.png'; // Import ảnh

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', form);
            login({
                userId: res.data.userId,
                username: res.data.username,
                role: res.data.role,
                avatarUrl: res.data.avatarUrl
            }, res.data.token);
            toast.success('Đăng nhập thành công!');
            navigate('/ponds');
        } catch (err) {
            toast.error('Sai tên đăng nhập hoặc mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.mainContainer}>
                {/* PHẦN 7: HÌNH ẢNH MINH HỌA */}
                <div style={styles.imageSection}>
                    <div style={styles.blurOverlay}></div>
                    <div style={styles.imageOverlay}>
                        <h1 style={styles.imageTitle}>AquaMonitor</h1>
                        <p style={styles.imageDesc}>Giải pháp quản lý ao nuôi thông minh cho tương lai.</p>
                    </div>
                </div>

                {/* PHẦN 3: FORM ĐĂNG NHẬP */}
                <div style={styles.formSection}>
                    <div style={styles.formContent}>
                        <h2 style={styles.title}>Chào mừng trở lại! 👋</h2>
                        <p style={styles.subtitle}>Vui lòng đăng nhập để bắt đầu !</p>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.field}>
                                <label style={styles.label}>Email hoặc Tên đăng nhập</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Nhập email hoặc tên đăng nhập"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Mật khẩu</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={styles.options}>
                                <label style={styles.rememberMe}>
                                    <input type="checkbox" /> Ghi nhớ tôi
                                </label>
                                <Link to="/forgot-password" style={styles.forgotPass}>Quên mật khẩu?</Link>
                            </div>

                            <button
                                style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>

                        <p style={styles.link}>
                            Mới sử dụng nền tảng?{' '}
                            <Link to="/register" style={{ color: '#5779d8', fontWeight: '600' }}>Tạo tài khoản</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F7FA', // Màu nền trung tính của các Dashboard hiện đại
    },
    mainContainer: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    // CHIẾM 7 PHẦN
    imageSection: {
        flex: 7,
        backgroundImage: `url(${bgImage})`, // Đường dẫn ảnh của bạn
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',    // Đưa nội dung xuống đáy
        justifyContent: 'flex-start', // Đưa nội dung sang trái
        padding: '40px',           // Khoảng cách từ nội dung đến mép ảnh
        position: 'relative',
        overflow: 'hidden',
    },
    blurOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Tạo một lớp phủ sáng nhẹ
        backdropFilter: 'blur(7px)', // LÀM MỜ: chỉnh số px cao hơn nếu muốn mờ hơn
        WebkitBackdropFilter: 'blur(8px)', // Hỗ trợ Safari
        zIndex: 1,
    },

    imageOverlay: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'left',         // Căn lề trái cho chữ
color: '#185FA5', // Hoặc màu trắng tùy vào độ sáng của ảnh
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '80%',           // Giới hạn chiều rộng để không tràn sang phần form
    },
    imageTitle: {
        fontSize: '32px',
        margin: '0 0 8px 0',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)' // Thêm bóng để dễ đọc trên nền mờ
    },
    imageDesc: {
        fontSize: '16px',
        margin: 0,
        opacity: 0.9
    },

    // CHIẾM 3 PHẦN
    formSection: {
        flex: 3,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
    },
    formContent: {
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '55px',
        fontWeight: '600',
        color: '#444',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '17px',
        color: '#888',
        marginBottom: '32px',
    },
    field: { marginBottom: '20px' },
    label: {
        display: 'block',
        fontSize: '20px',
        marginBottom: '8px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '6px',
        border: '1px solid #DBDADE',
        fontSize: '18px',
        boxSizing: 'border-box',
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        fontSize: '18px',
    },
    rememberMe: { color: '#666', cursor: 'pointer' },
    forgotPass: { color: '#1d4ed8', textDecoration: 'none' },
    button: {
        width: '100%',
        marginTop: '10px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 25px -5px rgba(29, 78, 216, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
    },
    link: {
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '24px',
        color: '#666',
    }
};