import { useNavigate } from 'react-router-dom';

export default function PondCard({ pond, onDelete }) {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        if (status === 'DANGER') return '#E24B4A';
        if (status === 'WARNING') return '#BA7517';
        return '#1D9E75';
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <div style={styles.name}>{pond.name}</div>
                    <div style={styles.location}>
                        📍 {pond.location || 'Chưa có vị trí'} · {pond.area || 0} m²
                    </div>
                </div>
                <div style={{
                    ...styles.statusBadge,
                    background: '#E1F5EE',
                    color: '#085041'
                }}>
                    Bình thường
                </div>
            </div>

            <div style={styles.stats}>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>Nhiệt độ</div>
                    <div style={styles.statVal}>-- °C</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>pH</div>
                    <div style={styles.statVal}>--</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>Oxy</div>
                    <div style={styles.statVal}>-- mg/L</div>
                </div>
            </div>

            <div style={styles.footer}>
                <span style={styles.footerInfo}>
                    Tạo lúc: {new Date(pond.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <div style={styles.actions}>
                    <button
                        style={styles.detailBtn}
                        onClick={() => navigate(`/ponds/${pond.id}`)}
                    >
                        Xem chi tiết →
                    </button>
                    <button
                        style={styles.deleteBtn}
                        onClick={() => onDelete(pond.id)}
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        cursor: 'default'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '16px 18px 12px'
    },
    name: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px'
    },
    location: {
        fontSize: '12px',
        color: '#888'
    },
    statusBadge: {
        fontSize: '11px',
        padding: '3px 10px',
        borderRadius: '20px',
        fontWeight: '500'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '0 18px 14px'
    },
    stat: {
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '10px 12px'
    },
    statLabel: {
        fontSize: '11px',
        color: '#888',
        marginBottom: '4px'
    },
    statVal: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#1a1a1a'
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        background: '#f8f9fa',
        borderTop: '1px solid #f0f0f0'
    },
    footerInfo: {
        fontSize: '11px',
        color: '#aaa'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    detailBtn: {
        padding: '5px 12px',
        background: '#185FA5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    deleteBtn: {
        padding: '5px 12px',
        background: '#fff',
        color: '#E24B4A',
        border: '1px solid #E24B4A',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer'
    }
};