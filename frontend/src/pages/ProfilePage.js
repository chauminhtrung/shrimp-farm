import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { getAvatarColor, getAvatarLetter } from '../utils/avatarHelper';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        avatarUrl: ''
    });

    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load thông tin user từ API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/api/users/${user.userId}`);
                setForm(f => ({
                    ...f,
                    fullName: res.data.fullName || '',
                    email: res.data.email || '',
                    avatarUrl: res.data.avatarUrl || ''
                }));
                if (res.data.avatarUrl) {
                    setAvatarPreview(res.data.avatarUrl);
                }
            } catch {
                toast.error('Không thể tải thông tin');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user.userId]);

    // Chọn ảnh từ máy — convert sang base64
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }

        // Kiểm tra kích thước (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ảnh không được vượt quá 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            setAvatarPreview(base64);
            setForm(f => ({ ...f, avatarUrl: base64 }));
        };
        reader.readAsDataURL(file);
    };

    // Xóa avatar
    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setForm(f => ({ ...f, avatarUrl: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.currentPassword) {
            toast.error('Vui lòng nhập mật khẩu hiện tại để xác nhận');
            return;
        }
        setSaving(true);
        try {
            const res = await api.put(`/api/users/${user.userId}`, {
                fullName: form.fullName,
                email: form.email,
                currentPassword: form.currentPassword,
                newPassword: form.newPassword || null,
                avatarUrl: form.avatarUrl || null
            });

            // Cập nhật lại context
            login({
                ...user,
                fullName: res.data.fullName,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl  // ← đảm bảo có dòng này
            }, localStorage.getItem('token'));

            toast.success('Cập nhật thành công!');
            setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Mật khẩu hiện tại không đúng');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
                Đang tải...
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Navbar />
            <div style={styles.container}>
                <button style={styles.backBtn} onClick={() => navigate('/ponds')}>
                    ← Quay lại Dashboard
                </button>

                <div style={styles.card}>
                    <h2 style={styles.pageTitle}>Thông tin cá nhân</h2>

                    {/* Avatar Section */}
                    <div style={styles.avatarSection}>
                        <div style={styles.avatarWrap}>
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="avatar"
                                    style={styles.avatarImg}
                                    onError={() => setAvatarPreview(null)}
                                />
                            ) : (
                                <div style={{
                                    ...styles.avatarFallback,
                                    background: getAvatarColor(user?.username)
                                }}>
                                    {getAvatarLetter(user)}
                                </div>
                            )}

                            {/* Overlay edit button */}
                            <div
                                style={styles.avatarOverlay}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span style={styles.avatarOverlayTxt}>📷</span>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />

                        <div style={styles.avatarActions}>
                            <button
                                type="button"
                                style={styles.changeAvatarBtn}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                📷 Đổi ảnh đại diện
                            </button>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    style={styles.removeAvatarBtn}
                                    onClick={handleRemoveAvatar}
                                >
                                    Xóa ảnh
                                </button>
                            )}
                        </div>
                        <div style={styles.avatarHint}>
                            Chấp nhận JPG, PNG, GIF · Tối đa 2MB
                        </div>

                        <div style={styles.usernameBadge}>
                            <span style={styles.usernameText}>@{user?.username}</span>
                            <span style={styles.roleBadge}>
                                {user?.role === 'ADMIN' ? '👑 Admin' : '🧑‍🌾 Farmer'}
                            </span>
                        </div>
                    </div>

                    <hr style={styles.divider} />

                    {/* Form */}
                    <form onSubmit={handleUpdate}>
                        <div style={styles.formGrid}>

                            {/* Họ tên */}
                            <div style={styles.field}>
                                <label style={styles.label}>Họ và tên</label>
                                <input
                                    style={styles.input}
                                    value={form.fullName}
                                    onChange={e => setForm({...form, fullName: e.target.value})}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            {/* Email */}
                            <div style={styles.field}>
                                <label style={styles.label}>Email</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    placeholder="email@gmail.com"
                                />
                            </div>

                            {/* Tên đăng nhập — readonly */}
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Tên đăng nhập
                                    <span style={styles.readonlyTag}>Không thể thay đổi</span>
                                </label>
                                <input
                                    style={{...styles.input, background: '#f8f9fa', color: '#888'}}
                                    value={user?.username}
                                    readOnly
                                />
                            </div>

                            <hr style={{...styles.divider, margin: '4px 0'}} />
                            <div style={styles.sectionLabel}>🔒 Bảo mật</div>

                            {/* Mật khẩu hiện tại */}
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Mật khẩu hiện tại
                                    <span style={styles.required}> *</span>
                                </label>
                                <div style={styles.pwdWrap}>
                                    <input
                                        style={styles.pwdInput}
                                        type={showCurrentPwd ? 'text' : 'password'}
                                        value={form.currentPassword}
                                        onChange={e => setForm({
                                            ...form, currentPassword: e.target.value
                                        })}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        style={styles.eyeBtn}
                                        onClick={() => setShowCurrentPwd(v => !v)}
                                    >
                                        {showCurrentPwd ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <div style={styles.fieldHint}>
                                    Bắt buộc để xác nhận thay đổi
                                </div>
                            </div>

                            {/* Mật khẩu mới */}
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Mật khẩu mới
                                    <span style={styles.optional}> (để trống nếu không đổi)</span>
                                </label>
                                <div style={styles.pwdWrap}>
                                    <input
                                        style={styles.pwdInput}
                                        type={showNewPwd ? 'text' : 'password'}
                                        value={form.newPassword}
                                        onChange={e => setForm({
                                            ...form, newPassword: e.target.value
                                        })}
                                        placeholder="Nhập mật khẩu mới..."
                                    />
                                    <button
                                        type="button"
                                        style={styles.eyeBtn}
                                        onClick={() => setShowNewPwd(v => !v)}
                                    >
                                        {showNewPwd ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.saveBtn,
                                opacity: saving ? 0.7 : 1
                            }}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '580px', margin: '0 auto', padding: '24px 20px' },
    backBtn: {
        background: 'none', border: 'none', color: '#185FA5',
        fontSize: '13px', cursor: 'pointer',
        marginBottom: '16px', fontWeight: '500', padding: 0
    },
    card: {
        background: '#fff', borderRadius: '14px',
        border: '1px solid #e8e8e8', padding: '28px'
    },
    pageTitle: {
        fontSize: '18px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '24px', textAlign: 'center'
    },

    // Avatar
    avatarSection: { textAlign: 'center', marginBottom: '20px' },
    avatarWrap: {
        position: 'relative', width: '90px', height: '90px',
        margin: '0 auto 12px', cursor: 'pointer'
    },
    avatarImg: {
        width: '90px', height: '90px', borderRadius: '50%',
        objectFit: 'cover', border: '3px solid #e8e8e8'
    },
    avatarFallback: {
        width: '90px', height: '90px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px', fontWeight: '700', color: '#fff',
        border: '3px solid #e8e8e8'
    },
    avatarOverlay: {
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity .2s',
        cursor: 'pointer',
        ':hover': { opacity: 1 }
    },
    avatarOverlayTxt: { fontSize: '22px' },
    avatarActions: {
        display: 'flex', gap: '8px',
        justifyContent: 'center', marginBottom: '6px'
    },
    changeAvatarBtn: {
        padding: '6px 14px', background: '#E6F1FB',
        color: '#185FA5', border: '1px solid #B5D4F4',
        borderRadius: '20px', fontSize: '12px',
        cursor: 'pointer', fontWeight: '500'
    },
    removeAvatarBtn: {
        padding: '6px 14px', background: '#FCEBEB',
        color: '#C62828', border: '1px solid #F5C0C0',
        borderRadius: '20px', fontSize: '12px', cursor: 'pointer'
    },
    avatarHint: { fontSize: '11px', color: '#bbb', marginBottom: '12px' },
    usernameBadge: {
        display: 'flex', gap: '8px',
        justifyContent: 'center', alignItems: 'center'
    },
    usernameText: { fontSize: '14px', color: '#555', fontWeight: '500' },
    roleBadge: {
        fontSize: '12px', padding: '2px 10px',
        background: '#E1F5EE', color: '#085041',
        borderRadius: '20px', fontWeight: '500'
    },

    divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' },
    sectionLabel: {
        fontSize: '13px', fontWeight: '600',
        color: '#555', marginBottom: '4px'
    },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '14px' },
    field: {},
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '500', color: '#333', marginBottom: '6px'
    },
    required: { color: '#E24B4A' },
    optional: { fontSize: '11px', color: '#aaa', fontWeight: '400' },
    readonlyTag: {
        fontSize: '10px', color: '#888',
        background: '#f5f5f5', padding: '2px 7px',
        borderRadius: '4px', marginLeft: '8px', fontWeight: '400'
    },
    input: {
        width: '100%', padding: '10px 12px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    },
    pwdWrap: { position: 'relative' },
    pwdInput: {
        width: '100%', padding: '10px 40px 10px 12px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    },
    eyeBtn: {
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)',
        background: 'none', border: 'none',
        fontSize: '16px', cursor: 'pointer', padding: '2px'
    },
    fieldHint: { fontSize: '11px', color: '#aaa', marginTop: '4px' },
    saveBtn: {
        width: '100%', marginTop: '20px', padding: '12px',
        background: '#185FA5', color: '#fff', border: 'none',
        borderRadius: '8px', fontSize: '14px',
        fontWeight: '500', cursor: 'pointer'
    }
};