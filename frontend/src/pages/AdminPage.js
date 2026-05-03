import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { getAvatarColor, getAvatarLetter } from '../utils/avatarHelper';

const TABS = [
    { key: 'stats',   label: '📊 Thống kê' },
    { key: 'posts',   label: '📝 Duyệt bài' },
    { key: 'users',   label: '👥 Quản lý User' },
];

const TAG_MAP = {
    EXPERIENCE: { label: 'Kinh nghiệm', bg: '#E6F1FB', color: '#185FA5' },
    DISEASE:    { label: 'Bệnh tôm',    bg: '#FCEBEB', color: '#C62828' },
    TECHNIQUE:  { label: 'Kỹ thuật',   bg: '#E1F5EE', color: '#1B5E20' },
    QA:         { label: 'Hỏi đáp',    bg: '#FAEEDA', color: '#7F4F00' },
};

export default function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect nếu không phải Admin
    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            toast.error('Bạn không có quyền truy cập trang này');
            navigate('/ponds');
        }
    }, [user]);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, postsRes, usersRes] = await Promise.all([
                api.get('/api/admin/stats'),
                api.get('/api/admin/posts/pending'),
                api.get('/api/admin/users'),
            ]);
            setStats(statsRes.data);
            setPendingPosts(postsRes.data);
            setUsers(usersRes.data);
        } catch {
            toast.error('Không thể tải dữ liệu admin');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/api/admin/posts/${id}/approve`);
            toast.success('Đã duyệt bài viết');
            fetchAll();
        } catch { toast.error('Thao tác thất bại'); }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Từ chối bài viết này?')) return;
        try {
            await api.put(`/api/admin/posts/${id}/reject`);
            toast.success('Đã từ chối bài viết');
            fetchAll();
        } catch { toast.error('Thao tác thất bại'); }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm('Xóa bài viết này?')) return;
        try {
            await api.delete(`/api/admin/posts/${id}`);
            toast.success('Đã xóa bài viết');
            fetchAll();
        } catch { toast.error('Xóa thất bại'); }
    };

    const handleToggleLock = async (id, locked) => {
        try {
            await api.put(`/api/admin/users/${id}/toggle-lock`);
            toast.success(locked ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
            fetchAll();
        } catch { toast.error('Thao tác thất bại'); }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
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

                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>👑 Admin Dashboard</h1>
                        <p style={styles.subtitle}>Quản lý toàn bộ hệ thống AquaMonitor</p>
                    </div>
                    <div style={styles.adminBadge}>Admin</div>
                </div>

                {/* Tabs */}
                <div style={styles.tabRow}>
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            style={{
                                ...styles.tabBtn,
                                background: activeTab === t.key ? '#185FA5' : '#fff',
                                color: activeTab === t.key ? '#fff' : '#555',
                                borderColor: activeTab === t.key ? '#185FA5' : '#ddd'
                            }}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                            {t.key === 'posts' && pendingPosts.length > 0 && (
                                <span style={styles.tabBadge}>
                                    {pendingPosts.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* TAB: STATS */}
                {activeTab === 'stats' && (
                    <div>
                        <div style={styles.statsGrid}>
                            {[
                                { label: 'Tổng người dùng', value: stats?.totalUsers, icon: '👥', color: '#185FA5', bg: '#E6F1FB' },
                                { label: 'Tổng ao nuôi',    value: stats?.totalPonds, icon: '🌊', color: '#1D9E75', bg: '#E1F5EE' },
                                { label: 'Bài viết',        value: stats?.totalPosts, icon: '📝', color: '#534AB7', bg: '#EEEDFE' },
                                { label: 'Chờ duyệt',       value: stats?.pendingPosts, icon: '⏳', color: '#BA7517', bg: '#FAEEDA' },
                                { label: 'Cảnh báo',        value: stats?.totalAlerts, icon: '🔔', color: '#C62828', bg: '#FCEBEB' },
                                { label: 'Dữ liệu sensor',  value: stats?.totalSensors, icon: '📡', color: '#0D6E8A', bg: '#E0F4FB' },
                            ].map((s, i) => (
                                <div key={i} style={{...styles.statCard, borderTop: `3px solid ${s.color}`}}>
                                    <div style={{...styles.statIcon, background: s.bg}}>
                                        {s.icon}
                                    </div>
                                    <div style={{...styles.statValue, color: s.color}}>
                                        {s.value ?? 0}
                                    </div>
                                    <div style={styles.statLabel}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick actions */}
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>⚡ Thao tác nhanh</div>
                            <div style={styles.quickActions}>
                                <button
                                    style={styles.quickBtn}
                                    onClick={() => setActiveTab('posts')}
                                >
                                    📝 Duyệt {pendingPosts.length} bài đang chờ
                                </button>
                                <button
                                    style={{...styles.quickBtn, background: '#E1F5EE', color: '#085041', borderColor: '#A8D5C2'}}
                                    onClick={() => setActiveTab('users')}
                                >
                                    👥 Quản lý {users.length} người dùng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: POSTS */}
                {activeTab === 'posts' && (
                    <div>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                📝 Bài viết chờ duyệt
                                <span style={styles.countBadge}>{pendingPosts.length}</span>
                            </h2>
                        </div>

                        {pendingPosts.length === 0 ? (
                            <div style={styles.emptyBox}>
                                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                                <div>Không có bài viết nào chờ duyệt</div>
                            </div>
                        ) : (
                            <div style={styles.postList}>
                                {pendingPosts.map(post => {
                                    const tag = TAG_MAP[post.tag] || {};
                                    return (
                                        <div key={post.id} style={styles.postCard}>
                                            <div style={styles.postCardHeader}>
                                                <div style={styles.authorRow}>
                                                    <div style={{
                                                        ...styles.avatar,
                                                        background: getAvatarColor(post.user?.username)
                                                    }}>
                                                        {getAvatarLetter(post.user)}
                                                    </div>
                                                    <div>
                                                        <div style={styles.authorName}>
                                                            {post.user?.fullName || post.user?.username}
                                                        </div>
                                                        <div style={styles.postTime}>
                                                            {timeAgo(post.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{
                                                    ...styles.tagBadge,
                                                    background: tag.bg,
                                                    color: tag.color
                                                }}>
                                                    {tag.label}
                                                </span>
                                            </div>

                                            <div style={styles.postTitle}>{post.title}</div>
                                            <div style={styles.postExcerpt}>
                                                {post.content?.length > 200
                                                    ? post.content.substring(0, 200) + '...'
                                                    : post.content}
                                            </div>

                                            <div style={styles.postActions}>
                                                <button
                                                    style={styles.approveBtn}
                                                    onClick={() => handleApprove(post.id)}
                                                >
                                                    ✅ Duyệt bài
                                                </button>
                                                <button
                                                    style={styles.rejectBtn}
                                                    onClick={() => handleReject(post.id)}
                                                >
                                                    ❌ Từ chối
                                                </button>
                                                <button
                                                    style={styles.deletePostBtn}
                                                    onClick={() => handleDeletePost(post.id)}
                                                >
                                                    🗑️ Xóa
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: USERS */}
                {activeTab === 'users' && (
                    <div>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                👥 Danh sách người dùng
                                <span style={styles.countBadge}>{users.length}</span>
                            </h2>
                        </div>

                        <div style={styles.card}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        {['#', 'Người dùng', 'Email', 'Vai trò', 'Trạng thái', 'Thao tác'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id} style={{
                                            background: u.locked ? '#FFF5F5' : '#fff'
                                        }}>
                                            <td style={styles.td}>{i + 1}</td>
                                            <td style={styles.td}>
                                                <div style={styles.userCell}>
                                                    <div style={{
                                                        ...styles.avatar,
                                                        width: '32px', height: '32px',
                                                        fontSize: '13px',
                                                        background: getAvatarColor(u.username)
                                                    }}>
                                                        {getAvatarLetter(u)}
                                                    </div>
                                                    <div>
                                                        <div style={styles.userName}>
                                                            {u.fullName || u.username}
                                                        </div>
                                                        <div style={styles.userHandle}>
                                                            @{u.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.emailText}>{u.email}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.rolePill,
                                                    background: u.role === 'ADMIN' ? '#FAEEDA' : '#E6F1FB',
                                                    color: u.role === 'ADMIN' ? '#7F4F00' : '#0C447C'
                                                }}>
                                                    {u.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.statusPill,
                                                    background: u.locked ? '#FCEBEB' : '#E1F5EE',
                                                    color: u.locked ? '#C62828' : '#085041'
                                                }}>
                                                    {u.locked ? '🔒 Bị khóa' : '✅ Hoạt động'}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        style={{
                                                            ...styles.lockBtn,
                                                            background: u.locked ? '#E1F5EE' : '#FCEBEB',
                                                            color: u.locked ? '#085041' : '#C62828',
                                                            borderColor: u.locked ? '#A8D5C2' : '#F5C0C0'
                                                        }}
                                                        onClick={() => handleToggleLock(u.id, u.locked)}
                                                    >
                                                        {u.locked ? '🔓 Mở khóa' : '🔒 Khóa'}
                                                    </button>
                                                )}
                                                {u.role === 'ADMIN' && (
                                                    <span style={{ fontSize: '12px', color: '#aaa' }}>
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '20px'
    },
    title: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a' },
    subtitle: { fontSize: '13px', color: '#888', marginTop: '3px' },
    adminBadge: {
        padding: '4px 14px', background: '#FAEEDA',
        color: '#7F4F00', borderRadius: '20px',
        fontSize: '13px', fontWeight: '600',
        border: '1px solid #F5D5A0'
    },
    tabRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
    tabBtn: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 18px', border: '1px solid',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    tabBadge: {
        background: '#E24B4A', color: '#fff',
        borderRadius: '20px', fontSize: '10px',
        padding: '1px 6px', fontWeight: '600'
    },
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px', marginBottom: '16px'
    },
    statCard: {
        background: '#fff', borderRadius: '12px',
        padding: '18px 16px', border: '1px solid #e8e8e8',
        textAlign: 'center'
    },
    statIcon: {
        width: '44px', height: '44px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', margin: '0 auto 10px'
    },
    statValue: { fontSize: '28px', fontWeight: '700', lineHeight: 1 },
    statLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
    card: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '18px 20px',
        marginBottom: '14px'
    },
    cardTitle: {
        fontSize: '14px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '14px'
    },
    quickActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    quickBtn: {
        padding: '10px 18px', background: '#E6F1FB',
        color: '#0C447C', border: '1px solid #B5D4F4',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    sectionHeader: { marginBottom: '14px' },
    sectionTitle: {
        fontSize: '16px', fontWeight: '600',
        color: '#1a1a1a', display: 'flex',
        alignItems: 'center', gap: '8px'
    },
    countBadge: {
        background: '#E6F1FB', color: '#185FA5',
        padding: '2px 10px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600'
    },
    emptyBox: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '60px',
        textAlign: 'center', color: '#888', fontSize: '14px'
    },
    postList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    postCard: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '18px 20px',
        borderLeft: '4px solid #BA7517'
    },
    postCardHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '10px'
    },
    authorRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    avatar: {
        width: '36px', height: '36px', borderRadius: '50%',
        color: '#fff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '14px', fontWeight: '600'
    },
    authorName: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
    postTime: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
    tagBadge: {
        fontSize: '11px', padding: '3px 10px',
        borderRadius: '20px', fontWeight: '500'
    },
    postTitle: {
        fontSize: '15px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '8px'
    },
    postExcerpt: {
        fontSize: '13px', color: '#666',
        lineHeight: 1.6, marginBottom: '14px'
    },
    postActions: { display: 'flex', gap: '8px' },
    approveBtn: {
        padding: '7px 16px', background: '#E1F5EE',
        color: '#085041', border: '1px solid #A8D5C2',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    rejectBtn: {
        padding: '7px 16px', background: '#FAEEDA',
        color: '#7F4F00', border: '1px solid #F5D5A0',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    deletePostBtn: {
        padding: '7px 16px', background: '#FCEBEB',
        color: '#C62828', border: '1px solid #F5C0C0',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        textAlign: 'left', padding: '10px 14px',
        fontSize: '12px', fontWeight: '600',
        color: '#888', borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
    },
    td: {
        padding: '12px 14px', fontSize: '13px',
        borderBottom: '1px solid #f5f5f5',
        color: '#333', verticalAlign: 'middle'
    },
    userCell: { display: 'flex', gap: '10px', alignItems: 'center' },
    userName: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
    userHandle: { fontSize: '11px', color: '#aaa', marginTop: '1px' },
    emailText: { fontSize: '12px', color: '#666' },
    rolePill: {
        fontSize: '11px', padding: '3px 10px',
        borderRadius: '20px', fontWeight: '500'
    },
    statusPill: {
        fontSize: '11px', padding: '3px 10px',
        borderRadius: '20px', fontWeight: '500'
    },
    lockBtn: {
        padding: '5px 12px', border: '1px solid',
        borderRadius: '6px', fontSize: '12px',
        cursor: 'pointer', fontWeight: '500'
    }
};