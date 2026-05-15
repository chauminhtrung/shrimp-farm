import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { getAvatarColor, getAvatarLetter } from '../utils/avatarHelper';
import { motion, AnimatePresence, color } from 'framer-motion';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [focusedField, setFocusedField] = useState(null);

    // State cho Theme (Dark/Light)
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Mock dữ liệu Activity Log (Thực tế sẽ lấy từ API)
    const activityLog = [
        { id: 1, event: "Lần đăng nhập cuối", time: "10:45 - 12/05/2026", icon: "🕒" },
        { id: 2, event: "Thiết bị đang sử dụng", time: "Chrome - Windows 11 (IP: 14.232.x.x)", icon: "💻" }
    ];

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        avatarUrl: ''
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 } // Mỗi phần tử con hiện cách nhau 0.1s
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }
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

            login({
                ...user,
                fullName: res.data.fullName,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl
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
        <div style={styles.page}>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '100px', color: '#38bdf8' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ fontSize: '40px', marginBottom: '10px' }}
                >
                    🌀
                </motion.div>
                Đang tải thông tin...
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <Navbar />
            
            <div style={styles.layoutWrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.mainColumn}
                >
                    <button style={styles.backBtn} onClick={() => navigate('/ponds')}>
                        <span>←</span> Quay lại Dashboard
                    </button>

                    <div style={styles.card}>
                        <h2 style={styles.pageTitle}>Cài đặt tài khoản</h2>

                        {/* Avatar Section */}
                        <div style={styles.avatarSection}>
                            <div style={styles.avatarContainer}> {/* Thêm container bọc ngoài */}

                                {/* Vòng sáng hoạt họa */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    style={styles.avatarGlowRing}
                                />

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={styles.avatarWrap}
                                >
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
                                    <div
                                        style={styles.avatarOverlay}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <span style={styles.avatarOverlayTxt}>📷</span>
                                    </div>
                                </motion.div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />

                            <div style={styles.avatarActions}>
                                <button type="button" style={styles.changeAvatarBtn} onClick={() => fileInputRef.current?.click()}>
                                    Thay đổi ảnh
                                </button>
                                <AnimatePresence>
                                    {avatarPreview && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            type="button"
                                            style={styles.removeAvatarBtn}
                                            onClick={handleRemoveAvatar}
                                        >
                                            Xóa ảnh
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={styles.usernameBadge}>
                                <span style={styles.usernameText}>@{user?.username}</span>
                                <span style={styles.roleBadge}>
                                    {user?.role === 'ADMIN' ? '👑 Admin' : '🧑‍🌾 Farmer'}
                                </span>
                            </div>
                        </div>

                        <div style={styles.divider} />
                        <motion.form
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleUpdate}
                            style={styles.formGrid}
                        >



                            {/* Họ và tên */}
                            <div style={styles.field}>
                                <label style={styles.label}>Họ và tên</label>
                                <input
                                    style={{
                                        ...styles.input,
                                        ...(focusedField === 'fullName' ? styles.inputFocus : {})
                                    }}
                                    value={form.fullName}
                                    onFocus={() => setFocusedField('fullName')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                    placeholder="Họ và tên của bạn"
                                />
                            </div>

                            {/* Email */}
                            <div style={styles.field}>
                                <label style={styles.label}>Email liên hệ</label>
                                <input
                                    style={{
                                        ...styles.input,
                                        ...(focusedField === 'email' ? styles.inputFocus : {})
                                    }}
                                    type="email"
                                    value={form.email}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="example@domain.com"
                                />
                            </div>



                            {/* Tên đăng nhập — readonly */}
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Tên đăng nhập
                                    <span style={styles.readonlyTag}> Không thể thay đổi</span>
                                </label>
                                <input
                                    style={{
                                        ...styles.input,
                                        background: 'rgba(203, 225, 255, 0.2)', // Chỉnh lại độ trong suốt cho hợp nền tối
                                        color: '#cbd5e1',
                                        cursor: 'not-allowed',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                    value={user?.username}
                                    readOnly
                                />
                            </div>

                            <div style={styles.divider} />
                            <div style={styles.sectionLabel}>🔒 Bảo mật tài khoản</div>

                            {/* Mật khẩu hiện tại */}
                            <div style={styles.field}>
                                <label style={styles.label}>Mật khẩu hiện tại <span style={styles.required}>*</span></label>
                                <div style={styles.pwdWrap}>
                                    <input
                                        style={{
                                            ...styles.input,
                                            ...(focusedField === 'currentPwd' ? styles.inputFocus : {})
                                        }}
                                        type={showCurrentPwd ? 'text' : 'password'}
                                        value={form.currentPassword}
                                        onFocus={() => setFocusedField('currentPwd')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                        placeholder="Xác nhận mật khẩu để lưu"
                                        required
                                    />
                                    <button type="button" style={styles.eyeBtn} onClick={() => setShowCurrentPwd(!showCurrentPwd)}>
                                        {showCurrentPwd ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {/* Mật khẩu mới */}
                            <div style={styles.field}>
                                <label style={styles.label}>Mật khẩu mới</label>
                                <input
                                    type={showNewPwd ? 'text' : 'password'}
                                    style={styles.input}
                                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                />
                                {/* Thanh đo độ mạnh mật khẩu */}
                                {form.newPassword && (
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={styles.strengthBarBg}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: form.newPassword.length > 8 ? '100%' : '40%',
                                                    backgroundColor: form.newPassword.length > 8 ? '#10b981' : '#f87171'
                                                }}
                                                style={styles.strengthBarInside}
                                            />
                                        </div>
                                        <span style={{ fontSize: '11px', color: form.newPassword.length > 8 ? '#10b981' : '#f87171' }}>
                                            {form.newPassword.length > 8 ? 'Mật khẩu an toàn' : 'Mật khẩu quá ngắn'}
                                        </span>
                                    </div>
                                )}
                            </div>





                            <div style={styles.divider} />

                            <motion.button
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 0 25px rgba(56, 189, 248, 0.6)",
                                    filter: "brightness(1.1)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                style={{
                                    ...styles.saveBtn,
                                    opacity: saving ? 0.7 : 1
                                }}
                                disabled={saving}
                            >
                                {saving ? 'Đang xử lý...' : '💾 Lưu tất cả thay đổi'}
                            </motion.button>
                        </motion.form>
                    </div>
                </motion.div>
                {/* --- CỘT PHẢI: CÁC WIDGET RỜI --- */}
                <div style={styles.sideColumn}>

                    {/* Widget 1: Theme */}
                    <motion.div
                        whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02 }}
                        style={styles.widgetCard}
                    >
                        <div style={styles.widgetHeader}>
                            <span style={styles.widgetTitle}>🎨 Giao diện</span>
                            <div
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                style={{ ...styles.toggleBtn, backgroundColor: isDarkMode ? '#38bdf8' : '#64748b' }}
                            >
                                <motion.div animate={{ x: isDarkMode ? 20 : 0 }} style={styles.toggleCircle} />
                            </div>
                        </div>
                        <p style={styles.widgetDesc}>{isDarkMode ? "Chế độ tối đang bật" : "Chế độ sáng đang bật"}</p>
                    </motion.div>

                    {/* Widget 2: Log */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02 }}
                        style={styles.widgetCard}
                    >
                        <div style={styles.sectionLabelSmall}>📊 Nhật ký hoạt động</div>
                        {activityLog.map(log => (
                            <div key={log.id} style={styles.logItem}>
                                <span>{log.icon}</span>
                                <div style={{ marginLeft: '12px' }}>
                                    <div style={styles.logEvent}>{log.event}</div>
                                    <div style={styles.logTime}>{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Widget 3: Thống kê nhanh */}
                    <motion.div
                        whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02 }}
                        style={{ ...styles.widgetCard, background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(255, 255, 255, 0.05))' }}
                    >
                        <div style={styles.sectionLabelSmall}>📊 Thống kê của bạn</div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>12</div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Dự án</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>156</div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Ngày tham gia</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#0f172a',
        backgroundAttachment: 'fixed',
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        paddingBottom: '50px',
        paddingTop: '50px', // Khoảng cách này giúp trang không bị Navbar che mất
    },
    layoutWrapper: {
        display: 'flex',
        gap: '30px',
        maxWidth: '1100px',
        margin: '40px auto',
        padding: '0 20px',
        perspective: '1200px', // Tạo chiều sâu cho hiệu ứng nghiêng
    },
    mainColumn: { flex: 2 },
    sideColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'sticky',
        top: '20px'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transformStyle: 'preserve-3d',
    },
    widgetCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.3s ease',
    },
    container: {
        maxWidth: '650px',
        margin: '40px auto',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'color 0.2s',
        padding: '0'
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '32px',
        textAlign: 'center',
        letterSpacing: '-0.02em'
    },
    avatarSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px'
    },
    avatarWrap: {
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '16px',
        cursor: 'pointer',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #38bdf8',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
    },
    avatarFallback: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: '700',
        color: '#fff',
        border: '3px solid rgba(255, 255, 255, 0.2)',
    },
    avatarOverlay: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        fontSize: '24px'
    },
    strengthBarBg: {
        width: '100%',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '4px'
    },
    strengthBarInside: {
        height: '100%',
        borderRadius: '10px',
        transition: 'all 0.3s ease'
    },
    bgGlow: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(56, 189, 248, 0.15)',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none'
    },
    // Chế độ hover CSS cho avatar overlay được xử lý qua inline hover nếu cần, 
    // nhưng ở đây ta dùng Framer Motion cho đơn giản.
    avatarActions: {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px'
    },
    changeAvatarBtn: {
        padding: '8px 16px',
        background: 'rgba(56, 189, 248, 0.1)',
        color: '#38bdf8',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    removeAvatarBtn: {
        padding: '8px 16px',
        background: 'rgba(239, 44, 44, 0.1)',
        color: '#f87171',
        border: '1px solid rgba(239, 44, 44, 0.2)',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    usernameBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '6px 14px',
        borderRadius: '99px'
    },
    usernameText: { color: '#94a3b8', fontSize: '16px', fontWeight: '500' },
    roleBadge: {
        fontSize: '13px',
        fontWeight: '800',
        color: '#10b981',
        textTransform: 'uppercase'
    },
    divider: {
        width: '100%',
        height: '1px',
        background: 'rgba(255, 255, 255, 0.1)',
        margin: '17px 0'
    },
    sectionLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#38bdf8',
        marginBottom: '10px'
    },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
    label: {
        display: 'block',
        fontSize: '15px',
        fontWeight: '500',
        color: '#94a3b8',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        background: 'rgba(0, 0, 0, 0.3)', // Tối hơn một chút để nổi bật nội dung
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#fff',
        padding: '12px 16px',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Hiệu ứng mượt mà
    },

    inputFocus: {
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid #38bdf8', // Viền xanh Cyan
        boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)', // Đổ bóng phát sáng
        transform: 'translateY(-1px)', // Nhích nhẹ lên tạo cảm giác nổi
    },

    pwdWrap: {
        position: 'relative',
        width: '100%'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
    },
    saveBtn: {
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
    avatarContainer: {
        position: 'relative',
        width: '125px',
        height: '105px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
    },

    avatarGlowRing: {
        position: 'absolute',
        width: '120px', // Lớn hơn avatar một chút
        height: '120px',
        borderRadius: '50%',
        border: '2px solid #38bdf8',
        boxShadow: '0 0 20px #38bdf8, inset 0 0 15px #38bdf8', // Phát sáng cả trong lẫn ngoài
        pointerEvents: 'none',
        zIndex: 0,
    },

    avatarWrap: {
        position: 'relative',
        width: '115px',
        height: '115px',
        cursor: 'pointer',
        zIndex: 1, // Đảm bảo avatar nằm trên vòng sáng
    },

    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #0f172a', // Tạo khoảng hở giữa ảnh và vòng sáng
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    },

    avatarFallback: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '44px',
        fontWeight: '700',
        color: '#fff',
        border: '3px solid #0f172a',
    },
    required: { color: '#f87171' },
    optional: { fontSize: '15px', color: '#64748b' },
    readonlyTag: { color: '#ffe2e2' },
    widgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    widgetTitle: { fontWeight: '700', color: '#38bdf8', fontSize: '17px' },
    toggleBtn: { width: '44px', height: '22px', borderRadius: '15px', cursor: 'pointer', padding: '2px' },
    toggleCircle: { width: '18px', height: '18px', background: '#fff', borderRadius: '50%' },
    logItem: { display: 'flex', alignItems: 'center', marginTop: '15px' },
    logEvent: { fontSize: '16px', fontWeight: '600' },
    logTime: { fontSize: '16px', color: '#64748b' },
    divider: { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' },
    backBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '10px' }
};