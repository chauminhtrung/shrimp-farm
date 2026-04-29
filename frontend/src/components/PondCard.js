import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PondCard({ pond, onDelete }) {
    const navigate = useNavigate();
    const [sensor, setSensor] = useState(null);

    useEffect(() => {
        const fetchSensor = async () => {
            try {
                const res = await api.get(`/api/sensor/latest/${pond.id}`);
                setSensor(res.data);
            } catch {
                setSensor(null);
            }
        };
        fetchSensor();
    }, [pond.id]);

    const getStatusInfo = () => {
        if (!sensor) return { text: 'Chưa có dữ liệu', bg: '#f5f5f5', color: '#888' };
        if (sensor.oxygen < 4.0 || sensor.ph > 8.5 || sensor.ph < 6.5)
            return { text: 'Cảnh báo', bg: '#FAEEDA', color: '#854F0B' };
        return { text: 'Bình thường', bg: '#E1F5EE', color: '#085041' };
    };

    const status = getStatusInfo();

    const getValColor = (val, min, max) => {
        if (!val) return '#1a1a1a';
        if (val < min || val > max) return '#E24B4A';
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
                    background: status.bg,
                    color: status.color
                }}>
                    {status.text}
                </div>
            </div>

            <div style={styles.stats}>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>Nhiệt độ</div>
                    <div style={{
                        ...styles.statVal,
                        color: getValColor(sensor?.temperature, 25, 32)
                    }}>
                        {sensor?.temperature?.toFixed(1) ?? '--'}
                        <span style={styles.unit}> °C</span>
                    </div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>pH</div>
                    <div style={{
                        ...styles.statVal,
                        color: getValColor(sensor?.ph, 6.5, 8.5)
                    }}>
                        {sensor?.ph?.toFixed(1) ?? '--'}
                    </div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statLabel}>Oxy</div>
                    <div style={{
                        ...styles.statVal,
                        color: getValColor(sensor?.oxygen, 4, 10)
                    }}>
                        {sensor?.oxygen?.toFixed(1) ?? '--'}
                        <span style={styles.unit}> mg/L</span>
                    </div>
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
        overflow: 'hidden'
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
    location: { fontSize: '12px', color: '#888' },
    statusBadge: {
        fontSize: '11px',
        padding: '3px 10px',
        borderRadius: '20px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
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
        fontWeight: '500'
    },
    unit: {
        fontSize: '11px',
        fontWeight: '400',
        color: '#888'
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        background: '#f8f9fa',
        borderTop: '1px solid #f0f0f0'
    },
    footerInfo: { fontSize: '11px', color: '#aaa' },
    actions: { display: 'flex', gap: '8px' },
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