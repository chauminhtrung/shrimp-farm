import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

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
                role: res.data.role
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>AquaMonitor</h2>
                <p style={styles.subtitle}>Hệ thống giám sát ao nuôi tôm</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Tên đăng nhập</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            value={form.username}
                            onChange={e => setForm({...form, username: e.target.value})}
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>
                    <button
                        style={{...styles.button, opacity: loading ? 0.7 : 1}}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p style={styles.link}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" style={{color: '#185FA5'}}>Đăng ký</Link>
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
        fontSize: '24px',
        fontWeight: '600',
        color: '#185FA5',
        textAlign: 'center',
        marginBottom: '4px'
    },
    subtitle: {
        fontSize: '13px',
        color: '#888',
        textAlign: 'center',
        marginBottom: '28px'
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '6px'
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