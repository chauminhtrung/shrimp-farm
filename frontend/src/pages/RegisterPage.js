import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import bgImage from '../assets/images/login-bg.png'; // Dùng chung ảnh với trang Login

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '', email: '', password: '', fullName: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/auth/register', form);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            toast.error('Đăng ký thất bại. Username có thể đã tồn tại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.mainContainer}>
                {/* PHẦN 7: HÌNH ẢNH MINH HỌA (Giống Login) */}
                <div style={styles.imageSection}>
                    <div style={styles.blurOverlay}></div>
                    <div style={styles.imageOverlay}>
                        <h1 style={styles.imageTitle}>AquaMonitor</h1>
                        <p style={styles.imageDesc}>Bắt đầu hành trình quản lý ao nuôi thông minh ngay hôm nay.</p>
                    </div>
                </div>

                {/* PHẦN 3: FORM ĐĂNG KÝ */}
                <div style={styles.formSection}>
                    <div style={styles.formContent}>
                        <h2 style={styles.title}>Tạo tài khoản 🚀</h2>
                        <p style={styles.subtitle}>Điền thông tin bên dưới để đăng ký</p>

                        <form onSubmit={handleSubmit}>
                            {[
                                { key: 'fullName', label: 'Họ tên', type: 'text', placeholder: 'Nguyễn Văn A' },
                                { key: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'farmer1' },
                                { key: 'email', label: 'Email', type: 'email', placeholder: 'email@gmail.com' },
                                { key: 'password', label: 'Mật khẩu', type: 'password', placeholder: '••••••••' },
                            ].map(field => (
                                <div key={field.key} style={styles.field}>
                                    <label style={styles.label}>{field.label}</label>
                                    <input
                                        style={styles.input}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={e => setForm({...form, [field.key]: e.target.value})}
                                        required
                                    />
                                </div>
                            ))}

                            <button
                                style={{...styles.button, opacity: loading ? 0.7 : 1}}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                            </button>
                        </form>

                        <p style={styles.link}>
                            Đã có tài khoản?{' '}
                            <Link to="/login" style={{color: '#1d4ed8', fontWeight: '600'}}>Đăng nhập ngay</Link>
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
        backgroundColor: '#F8F7FA',
    },
    mainContainer: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    imageSection: {
        flex: 7,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
    },
    blurOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        zIndex: 1,
    },
    imageOverlay: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'left',
        color: '#185FA5',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '80%',
    },
    imageTitle: {
        fontSize: '32px',
        margin: '0 0 8px 0',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    imageDesc: {
        fontSize: '16px',
        margin: 0,
        opacity: 0.9
    },
    formSection: {
        flex: 3,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        overflowY: 'auto', // Thêm cái này vì form đăng ký dài hơn, tránh bị mất phía dưới
    },
    formContent: {
        width: '100%',
        maxWidth: '400px',
        padding: '20px 0',
    },
    title: {
        fontSize: '32px', // Giảm một chút so với 55px của login để vừa khung hình
        fontWeight: '600',
        color: '#444',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '15px',
        color: '#888',
        marginBottom: '24px',
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block',
        fontSize: '14px', // Giảm từ 20px xuống 14px để form không quá dài
        marginBottom: '6px',
        color: '#555',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #DBDADE',
        fontSize: '15px',
        boxSizing: 'border-box',
        outline: 'none'
    },
    button: {
        width: '100%',
        marginTop: '15px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 25px -5px rgba(29, 78, 216, 0.4)',
        transition: 'all 0.3s ease',
    },
    link: {
        textAlign: 'center',
        fontSize: '14px',
        marginTop: '20px',
        color: '#666',
    }
};