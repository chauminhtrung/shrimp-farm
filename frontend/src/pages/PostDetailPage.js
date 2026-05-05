import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CommunityNavbar from '../components/CommunityNavbar';
import { getAvatarColor, getAvatarLetter, getAvatarSrc } from '../utils/avatarHelper';
import Avatar from '../components/Avatar';
const TAG_MAP = {
    EXPERIENCE: { label: 'Kinh nghiệm', bg: '#E6F1FB', color: '#185FA5' },
    DISEASE:    { label: 'Bệnh tôm',    bg: '#FCEBEB', color: '#C62828' },
    TECHNIQUE:  { label: 'Kỹ thuật',   bg: '#E1F5EE', color: '#1B5E20' },
    QA:         { label: 'Hỏi đáp',    bg: '#FAEEDA', color: '#7F4F00' },
};

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        try {
            const [postRes, cmtRes] = await Promise.all([
                api.get(`/api/posts/${id}`),
                api.get(`/api/comments?postId=${id}`)
            ]);
            setPost(postRes.data);
            setComments(cmtRes.data);
        } catch {
            toast.error('Không tìm thấy bài viết');
            navigate('/community');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPost(); }, [id]);

    const handleLike = async () => {
        try {
            await api.put(`/api/posts/${id}/like`);
            fetchPost();
        } catch {
            toast.error('Vui lòng đăng nhập để thích bài');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) {
            toast.error('Vui lòng đăng nhập để bình luận');
            return;
        }
        try {
            await api.post('/api/comments', {
                postId: parseInt(id),
                userId: user.userId,
                content: newComment
            });
            setNewComment('');
            fetchPost();
            toast.success('Đã đăng bình luận');
        } catch {
            toast.error('Bình luận thất bại');
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

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <CommunityNavbar />
            <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
                Đang tải...
            </div>
        </div>
    );

    const tag = TAG_MAP[post?.tag] || {};

    return (
        <div style={styles.page}>
            <CommunityNavbar />
            <div style={styles.container}>

                {/* Back */}
                <button
                    style={styles.backBtn}
                    onClick={() => navigate('/community')}
                >
                    ← Quay lại cộng đồng
                </button>

                {/* Post */}
                <div style={styles.postCard}>
                    <div style={styles.postHeader}>
                        <div style={styles.authorRow}>
                <Avatar
                    user={{
                        username: post.username,
                        fullName: post.fullName,
                        avatarUrl: post.avatarUrl
                    }}
                    size={34}
                />
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
                {/* Ảnh bài viết */}
                {post?.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="post"
                        style={{
                            width: '100%', maxHeight: '300px',
                            objectFit: 'cover', borderRadius: '8px',
                            marginBottom: '16px'
                        }}
                        onError={e => e.target.style.display = 'none'}
                    />
                )}
                    <h1 style={styles.postTitle}>{post?.title}</h1>
                    <div style={styles.postContent}>{post?.content}</div>

                    <div style={styles.postFooter}>
                        <button style={styles.likeBtn} onClick={handleLike}>
                            ❤️ {post?.likes || 0} lượt thích
                        </button>
                        <span style={styles.commentCountTxt}>
                            💬 {comments.length} bình luận
                        </span>
                    </div>
                </div>

                {/* Comments */}
                <div style={styles.commentSection}>
                    <h3 style={styles.commentTitle}>
                        Bình luận ({comments.length})
                    </h3>

                    {/* Comment form */}
                    <form onSubmit={handleComment} style={styles.commentForm}>
                        <div style={styles.commentInputRow}>
                        <Avatar user={user} size={36} />
                            <input
                                style={styles.commentInput}
                                placeholder={
                                    user
                                        ? 'Viết bình luận của bạn...'
                                        : 'Đăng nhập để bình luận'
                                }
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                disabled={!user}
                            />
                            <button
                                type="submit"
                                style={{
                                    ...styles.submitCommentBtn,
                                    opacity: !user ? 0.5 : 1
                                }}
                                disabled={!user}
                            >
                                Gửi
                            </button>
                        </div>
                    </form>

                    {/* Comment list */}
                    {comments.length === 0 ? (
                        <div style={styles.noComment}>
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                        </div>
                    ) : (
                        <div style={styles.commentList}>
                            {comments.map(cmt => (
                                <div key={cmt.id} style={styles.commentItem}>
                                <Avatar
                                    user={{
                                        username: cmt.username,
                                        fullName: cmt.fullName,
                                        avatarUrl: cmt.avatarUrl
                                    }}
                                    size={34}
                                />
                                    <div style={styles.commentBody}>
                                        <div style={styles.commentHeader}>
                                            <span style={styles.commentAuthor}>
                                                {cmt.fullName || cmt.username}
                                            </span>
                                            <span style={styles.commentTime}>
                                                 {timeAgo(cmt.createdAt)}
                                            </span>
                                        </div>
                                        <div style={styles.commentText}>
                                            {cmt.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f4f8' },
    container: { maxWidth: '760px', margin: '0 auto', padding: '20px' },
    backBtn: {
        background: 'none', border: 'none',
        color: '#1D9E75', fontSize: '13px',
        cursor: 'pointer', marginBottom: '16px',
        fontWeight: '500', padding: '0'
    },
    postCard: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '24px',
        marginBottom: '16px'
    },
    postHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '16px'
    },
    authorRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    avatar: {
        width: '36px', height: '36px', borderRadius: '50%',
        background: '#185FA5', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: '600'
    },
    authorName: { fontSize: '14px', fontWeight: '500', color: '#1a1a1a' },
    postTime: { fontSize: '12px', color: '#aaa', marginTop: '2px' },
    tagBadge: {
        fontSize: '11px', padding: '3px 10px',
        borderRadius: '20px', fontWeight: '500'
    },
    postTitle: {
        fontSize: '22px', fontWeight: '700',
        color: '#1a1a1a', marginBottom: '16px', lineHeight: 1.4
    },
    postContent: {
        fontSize: '15px', color: '#333',
        lineHeight: 1.8, marginBottom: '20px',
        whiteSpace: 'pre-wrap'
    },
    postFooter: {
        display: 'flex', gap: '16px', alignItems: 'center',
        paddingTop: '14px', borderTop: '1px solid #f0f0f0'
    },
    likeBtn: {
        background: '#FCEBEB', border: 'none',
        color: '#C62828', padding: '6px 14px',
        borderRadius: '20px', fontSize: '13px',
        cursor: 'pointer', fontWeight: '500'
    },
    commentCountTxt: { fontSize: '13px', color: '#666' },
    commentSection: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '20px'
    },
    commentTitle: {
        fontSize: '15px', fontWeight: '600',
        color: '#1a1a1a', marginBottom: '16px'
    },
    commentForm: { marginBottom: '20px' },
    commentInputRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    commentInput: {
        flex: 1, padding: '9px 14px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '13px', outline: 'none'
    },
    submitCommentBtn: {
        padding: '9px 18px', background: '#1D9E75',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '500', cursor: 'pointer'
    },
    noComment: {
        textAlign: 'center', padding: '24px',
        color: '#aaa', fontSize: '13px'
    },
    commentList: { display: 'flex', flexDirection: 'column', gap: '14px' },
    commentItem: { display: 'flex', gap: '10px' },
    commentBody: {
        flex: 1, background: '#f8f9fa',
        borderRadius: '8px', padding: '10px 14px'
    },
    commentHeader: {
        display: 'flex', gap: '8px',
        alignItems: 'center', marginBottom: '5px'
    },
    commentAuthor: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
    commentTime: { fontSize: '11px', color: '#bbb' },
    commentText: { fontSize: '13px', color: '#333', lineHeight: 1.6 }
};