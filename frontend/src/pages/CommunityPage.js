import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CommunityNavbar from '../components/CommunityNavbar';
import CreatePostModal from '../components/CreatePostModal';
import { getAvatarColor, getAvatarLetter, getAvatarSrc } from '../utils/avatarHelper';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion'; 

const TAGS = [
    { key: null, label: '🌊 Tất cả' },
    { key: 'EXPERIENCE', label: '💡 Kinh nghiệm' },
    { key: 'DISEASE', label: '🦠 Bệnh tôm' },
    { key: 'TECHNIQUE', label: '⚙️ Kỹ thuật' },
    { key: 'QA', label: '❓ Hỏi đáp' },
];

const TAG_MAP = {
    EXPERIENCE: { label: 'Kinh nghiệm', bg: '#E6F1FB', color: '#185FA5' },
    DISEASE:    { label: 'Bệnh tôm',    bg: '#FCEBEB', color: '#C62828' },
    TECHNIQUE:  { label: 'Kỹ thuật',   bg: '#E1F5EE', color: '#1B5E20' },
    QA:         { label: 'Hỏi đáp',    bg: '#FAEEDA', color: '#7F4F00' },
};

export default function CommunityPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            let url = '/api/posts';
            if (keyword) url += `?keyword=${keyword}`;
            else if (activeTag) url += `?tag=${activeTag}`;
            const res = await api.get(url);
            setPosts(res.data);
        } catch {
            toast.error('Không thể tải bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, [activeTag]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts();
    };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    if (!user) {
        toast.error('Vui lòng đăng nhập để thích bài viết');
        return;
    }
    try {
        await api.put(`/api/posts/${postId}/like?userId=${user.userId}`);
        fetchPosts();
    } catch {
        toast.error('Thao tác thất bại');
    }
};

        const handleCreate = async (formData) => {
            try {
                await api.post('/api/posts', {
                    ...formData,
                    userId: user.userId
                });
                toast.success('Đăng bài thành công! Bài viết đang chờ kiểm duyệt.');
                setShowModal(false);
            } catch {
                toast.error('Đăng bài thất bại');
            }
        };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr);
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 60) return `${mins} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    return (
           <motion.div 
                  // HIỆU ỨNG MỞ TRANG (LOAD PAGE)
                  initial={{ opacity: 0 }}       // Ban đầu ẩn hoàn toàn (Màn hình trắng/trống)
                  animate={{ opacity: 1 }}       // Từ từ hiện rõ lên
                  transition={{ duration: 1, ease: 'easeInOut' }} // Chạy mượt trong 1 giây
                  style={styles.page}
              >
            <CommunityNavbar />

            <div style={styles.container}>
                <div style={styles.layout}>

                    {/* LEFT — Posts */}
                    <div style={styles.main}>

                        {/* Header */}
                        <div style={styles.header}>
                            <div>
                                <h1 style={styles.title}>Cộng đồng nuôi tôm</h1>
                                <p style={styles.subtitle}>
                                    Chia sẻ kinh nghiệm và học hỏi từ cộng đồng
                                </p>
                            </div>
                            {user && (
                                <button
                                    style={styles.createBtn}
                                    onClick={() => setShowModal(true)}
                                >
                                    + Đăng bài
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} style={styles.searchRow}>
                            <input
                                style={styles.searchInput}
                                placeholder="🔍 Tìm kiếm bài viết..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                            />
                            <button type="submit" style={styles.searchBtn}>
                                Tìm
                            </button>
                        </form>

                        {/* Tags filter */}
                        <div style={styles.tagRow}>
                            {TAGS.map(t => (
                                <button
                                    key={t.key}
                                    style={{
                                        ...styles.tagBtn,
                                        background: activeTag === t.key
                                            ? '#185FA5' : '#fff',
                                        color: activeTag === t.key
                                            ? '#fff' : '#555',
                                        borderColor: activeTag === t.key
                                            ? '#185FA5' : '#ddd'
                                    }}
                                    onClick={() => {
                                        setActiveTag(t.key);
                                        setKeyword('');
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Posts list */}
                        {loading ? (
                            <div style={styles.loading}>Đang tải...</div>
                        ) : posts.length === 0 ? (
                            <div style={styles.empty}>
                                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                                <div>Chưa có bài viết nào</div>
                                {user && (
                                    <button
                                        style={{...styles.createBtn, marginTop: '16px'}}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Đăng bài đầu tiên
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={styles.postList}>
                                {posts.map(post => {
                                    const tag = TAG_MAP[post.tag] || {};
                                    return (
                                        <div
                                            key={post.id}
                                            style={styles.postCard}
                                            onClick={() => navigate(`/community/${post.id}`)}
                                        >
                                            <div style={styles.postHeader}>
                                                <div style={styles.authorRow}>
                                            <div style={styles.avatar}>
                                         <Avatar
                                            user={{
                                                username: post.username,
                                                fullName: post.fullName,
                                                avatarUrl: post.avatarUrl
                                            }}
                                            size={34}
                                        />
                                            </div>
                                                    <div>
                                                <div style={styles.authorName}>
                                                    {post.fullName || post.username}
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
                                                {post.content?.length > 150
                                                    ? post.content.substring(0, 150) + '...'
                                                    : post.content}
                                            </div>

                                            <div style={styles.postFooter}>
                                                <button
                                                    style={styles.likeBtn}
                                                    onClick={(e) => handleLike(post.id, e)}
                                                >
                                                    ❤️ {post.likes || 0}
                                                </button>
                                                <span style={styles.commentCount}>
                                                    💬 Xem bình luận →
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Sidebar */}
                    <div style={styles.sidebar}>
                        {/* User info */}
                        {user ? (
                            <div style={styles.sideCard}>
                                <div style={styles.sideAvatar}>
                                   {getAvatarSrc(user) ? (
                                       <img
                                           src={getAvatarSrc(user)}
                                           alt="avatar"
                                           style={{
                                               width: '60px', height: '60px',
                                               borderRadius: '50%', objectFit: 'cover',
                                               cursor: 'pointer', border: '2px solid rgba(255,255,255,0.5)'
                                           }}
                                           onClick={() => navigate('/profile')}
                                       />
                                   ) : (
                                       <div
                                           style={{
                                               width: '50px', height: '50px', borderRadius: '50%',
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
                                </div>
                                <div style={styles.sideUsername}>{user.username}</div>
                                <div style={styles.sideRole}>
                                    {user.role === 'ADMIN' ? '👑 Admin' : '🧑‍🌾 Người nuôi tôm'}
                                </div>
                                <button
                                    style={styles.sideBtn}
                                    onClick={() => setShowModal(true)}
                                >
                                    + Đăng bài mới
                                </button>
                                <button
                                    style={styles.sideBtnGhost}
                                    onClick={() => navigate('/ponds')}
                                >
                                    → Vào Dashboard
                                </button>
                            </div>
                        ) : (
                            <div style={styles.sideCard}>
                                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🦐</div>
                                <div style={styles.sideUsername}>Tham gia cộng đồng</div>
                                <div style={{
                                    fontSize: '12px', color: '#888',
                                    marginBottom: '14px', lineHeight: 1.5
                                }}>
                                    Đăng nhập để đăng bài và tương tác với cộng đồng
                                </div>
                                <button
                                    style={styles.sideBtn}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    style={styles.sideBtnGhost}
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký miễn phí
                                </button>
                            </div>
                        )}

                        {/* Stats */}
                        <div style={styles.sideCard}>
                            <div style={styles.sideCardTitle}>📊 Thống kê</div>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Tổng bài viết</span>
                                <span style={styles.statVal}>{posts.length}</span>
                            </div>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Kinh nghiệm</span>
                                <span style={styles.statVal}>
                                    {posts.filter(p => p.tag === 'EXPERIENCE').length}
                                </span>
                            </div>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Bệnh tôm</span>
                                <span style={styles.statVal}>
                                    {posts.filter(p => p.tag === 'DISEASE').length}
                                </span>
                            </div>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Hỏi đáp</span>
                                <span style={styles.statVal}>
                                    {posts.filter(p => p.tag === 'QA').length}
                                </span>
                            </div>
                        </div>

                        {/* Tips */}
                        <div style={{...styles.sideCard, background: '#E6F1FB'}}>
                            <div style={styles.sideCardTitle}>💡 Mẹo hay</div>
                            <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>
                                Kiểm tra oxy hòa tan vào sáng sớm (5–6h)
                                vì đây là thời điểm oxy thấp nhất trong ngày.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <CreatePostModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
     </motion.div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f4f8' },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '100px 20px 30px 20px',},
    layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' },
    main: {},
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '16px'
    },
    title: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a' },
    subtitle: { fontSize: '13px', color: '#888', marginTop: '3px' },
    createBtn: {
        padding: '8px 16px', background: '#185FA5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '500', cursor: 'pointer'
    },
    searchRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
    searchInput: {
        flex: 1, padding: '9px 14px', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '13px', outline: 'none'
    },
    searchBtn: {
        padding: '9px 18px', background: '#185FA5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', cursor: 'pointer'
    },
    tagRow: { display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' },
    tagBtn: {
        padding: '5px 14px', border: '1px solid',
        borderRadius: '20px', fontSize: '12px',
        cursor: 'pointer', fontWeight: '500'
    },
    loading: { textAlign: 'center', padding: '40px', color: '#888' },
    empty: {
        textAlign: 'center', padding: '60px',
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', color: '#888', fontSize: '14px'
    },
    postList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    postCard: {
        background: '#fff', border: '1px solid #e8e8e8',
        borderRadius: '12px', padding: '18px 20px',
        cursor: 'pointer', transition: 'box-shadow 0.15s'
    },
    postHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '10px'
    },
    authorRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    avatar: {
        width: '34px', height: '34px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: '600', flexShrink: 0
    },
    authorName: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
    postTime: { fontSize: '11px', color: '#aaa', marginTop: '1px' },
    tagBadge: {
        fontSize: '11px', padding: '3px 10px',
        borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap'
    },
    postTitle: {
        fontSize: '15px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '8px', lineHeight: 1.4
    },
    postExcerpt: {
        fontSize: '13px', color: '#666',
        lineHeight: 1.6, marginBottom: '12px'
    },
    postFooter: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: '10px',
        borderTop: '1px solid #f0f0f0'
    },
    likeBtn: {
        background: 'none', border: 'none',
        fontSize: '13px', color: '#666', cursor: 'pointer', padding: '2px 6px'
    },
    commentCount: { fontSize: '12px', color: '#185FA5' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '14px' },
    sideCard: {
        
        background: '#fff', border: '1px solid #e8e8e8',
        borderRadius: '12px', padding: '16px',
        textAlign: 'center'
    },
    sideAvatar: {
        width: '48px', height: '48px', borderRadius: '50%',

        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', fontWeight: '600', margin: '0 auto 10px'
    },
    sideUsername: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
    sideRole: { fontSize: '12px', color: '#888', marginBottom: '14px' },
    sideBtn: {
        width: '100%', padding: '8px', background: '#185FA5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '8px'
    },
    sideBtnGhost: {
        width: '100%', padding: '8px', background: 'transparent',
        color: '#185FA5', border: '1px solid #185FA5',
        borderRadius: '8px', fontSize: '13px', cursor: 'pointer'
    },
    sideCardTitle: {
        fontSize: '13px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '12px', textAlign: 'left'
    },
    statRow: {
        display: 'flex', justifyContent: 'space-between',
        padding: '6px 0', borderBottom: '1px solid #f5f5f5', textAlign: 'left'
    },
    statLabel: { fontSize: '12px', color: '#666' },
    statVal: { fontSize: '13px', fontWeight: '600', color: '#185FA5' },
};