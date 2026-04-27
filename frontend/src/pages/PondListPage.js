import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PondCard from '../components/PondCard';
import CreatePondModal from '../components/CreatePondModal';

export default function PondListPage() {
    const { user } = useAuth();
    const [ponds, setPonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Load danh sách ao
    const fetchPonds = async () => {
        try {
            const res = await api.get(`/api/ponds?userId=${user.userId}`);
            setPonds(res.data);
        } catch (err) {
            toast.error('Không thể tải danh sách ao');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPonds();
    }, []);

    // Tạo ao mới
    const handleCreate = async (formData) => {
        try {
            await api.post('/api/ponds', {
                ...formData,
                userId: user.userId
            });
            toast.success('Tạo ao thành công!');
            setShowModal(false);
            fetchPonds();
        } catch (err) {
            toast.error('Tạo ao thất bại');
        }
    };

    // Xóa ao
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa ao này?')) return;
        try {
            await api.delete(`/api/ponds/${id}`);
            toast.success('Đã xóa ao');
            fetchPonds();
        } catch (err) {
            toast.error('Xóa ao thất bại');
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Ao nuôi của tôi</h1>
                        <p style={styles.subtitle}>
                            Quản lý và theo dõi {ponds.length} ao nuôi tôm
                        </p>
                    </div>
                    <button
                        style={styles.createBtn}
                        onClick={() => setShowModal(true)}
                    >
                        + Tạo ao mới
                    </button>
                </div>

                {/* Stats */}
                <div style={styles.statsRow}>
                    {[
                        { label: 'Tổng số ao', value: ponds.length, color: '#185FA5' },
                        { label: 'Đang hoạt động', value: ponds.length, color: '#1D9E75' },
                        { label: 'Cảnh báo', value: 0, color: '#BA7517' },
                    ].map((s, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={{...styles.statVal, color: s.color}}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Pond list */}
                {loading ? (
                    <div style={styles.loading}>Đang tải...</div>
                ) : ponds.length === 0 ? (
                    <div style={styles.empty}>
                        <div style={styles.emptyIcon}>🦐</div>
                        <div style={styles.emptyText}>Chưa có ao nuôi nào</div>
                        <button
                            style={styles.createBtn}
                            onClick={() => setShowModal(true)}
                        >
                            + Tạo ao đầu tiên
                        </button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {ponds.map(pond => (
                            <PondCard
                                key={pond.id}
                                pond={pond}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <CreatePondModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f4f8' },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '20px'
    },
    title: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a' },
    subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' },
    createBtn: {
        padding: '9px 18px', background: '#185FA5', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    statsRow: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px', marginBottom: '20px'
    },
    statCard: {
        background: '#fff', borderRadius: '10px',
        padding: '16px 20px', border: '1px solid #e8e8e8'
    },
    statVal: { fontSize: '26px', fontWeight: '600', lineHeight: 1 },
    statLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '14px'
    },
    loading: { textAlign: 'center', padding: '60px', color: '#888' },
    empty: {
        textAlign: 'center', padding: '60px',
        background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8'
    },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    emptyText: { fontSize: '15px', color: '#888', marginBottom: '16px' }
};