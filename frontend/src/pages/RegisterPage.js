import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Đăng ký tài khoản</h2>
                <p style={styles.subtitle}>AquaMonitor</p>

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
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p style={styles.link}>
                    Đã có tài khoản?{' '}
                    <Link to="/login" style={{color: '#185FA5'}}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8'
    },
    card: {
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#185FA5',
        textAlign: 'center',
        marginBottom: '4px'
    },
    subtitle: {
        fontSize: '13px',
        color: '#888',
        textAlign: 'center',
        marginBottom: '24px'
    },
    field: { marginBottom: '14px' },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '5px'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        background: '#185FA5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '8px'
    },
    link: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#666',
        marginTop: '16px'
    }
};