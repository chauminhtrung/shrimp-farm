import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function PondCard({ pond, onDelete }) {
    const navigate = useNavigate();
    const [sensor, setSensor] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const idealRanges = {
        oxygen: { min: 4, max: 10, unit: 'mg/L', label: 'Oxy hòa tan' },
        ph: { min: 6.5, max: 8.5, unit: 'pH', label: 'Độ pH' },
        temp: { min: 25, max: 32, unit: '°C', label: 'Nhiệt độ' }
    };

    const pulseStyle = `
        @keyframes alertPulse {
            0% { border-color: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); }
            50% { border-color: #f87171; box-shadow: 0 0 20px rgba(239, 68, 68, 0.7); }
            100% { border-color: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); }
        }
        .progress-group:hover .tooltip {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) translateY(-8px) !important;
        }
    `;

    useEffect(() => {
        const fetchSensor = async () => {
            try {
                const res = await api.get(`/api/sensor/latest/${pond.id}`);
                setSensor(res.data);
            } catch { setSensor(null); }
        };
        fetchSensor();
        const interval = setInterval(fetchSensor, 15000);
        return () => clearInterval(interval);
    }, [pond.id]);

    const getStatusInfo = () => {
        if (!sensor) return { text: 'Chưa có dữ liệu', bg: 'rgba(255,255,255,0.05)', color: '#888' };
        if (sensor.oxygen < 4.0 || sensor.ph > 8.5 || sensor.ph < 6.5)
            return { text: 'Cảnh báo', bg: '#fee2e2', color: '#ef4444' };
        return { text: 'Bình thường', bg: '#E1F5EE', color: '#085041' };
    };

    const status = getStatusInfo();
    const isAlert = status.text === 'Cảnh báo';

    // Component con cho từng thanh chỉ số
    const ProgressBar = ({ label, value, type }) => {
        const ideal = idealRanges[type];
        const maxVal = type === 'temp' ? 40 : (type === 'ph' ? 14 : 12);
        const isOutOfRange = value < ideal.min || value > ideal.max;

        return (
            <div style={styles.progressWrapper} className="progress-group">
                <div style={styles.progressHeader}>
                    <span style={styles.statLabel}>{label}: </span>
                    <span style={{
                        ...styles.statVal,
                        color: isOutOfRange ? '#ef4444' : '#22c55e',
                        fontSize: '19px'
                    }}>
                        {value ? value.toFixed(1) : '--'} <small style={styles.unit}>{ideal.unit}</small>
                    </span>
                </div>
                <div style={styles.track}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((value / maxVal) * 100, 100)}%` }}
                        style={{
                            ...styles.bar,
                            background: isOutOfRange
                                ? 'linear-gradient(90deg, #f87171, #ef4444)'
                                : 'linear-gradient(90deg, #34d399, #10b981)',
                            boxShadow: isOutOfRange
                                ? '0 0 10px rgba(239, 68, 68, 0.5)'
                                : '0 0 10px rgba(16, 185, 129, 0.5)'
                        }}
                        whileHover={{ filter: "brightness(1.3)", boxShadow: "0 0 20px currentColor" }}
                    />
                    <div className="tooltip" style={styles.tooltip}>
                        Lý tưởng: {ideal.min} - {ideal.max} {ideal.unit}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            ...styles.card,
            animation: isAlert ? 'alertPulse 1.5s infinite' : 'none',
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            borderColor: isAlert ? '#ef4444' : (isHovered ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
            boxShadow: isAlert ? '0 0 20px rgba(239, 68, 68, 0.4)' : (isHovered ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'),
        }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/ponds/${pond.id}`)}
        >
            <style>{pulseStyle}</style>

            <div style={styles.header}>
                <div>
                    <div style={styles.name}>{pond.name}</div>
                    <div style={styles.location}>📍 {pond.location || 'Chưa rõ'} · {pond.area || 0} m²</div>
                </div>
                <div style={{
                    ...styles.statusBadge,
                    background: status.bg,
                    color: status.color,
                }}>{status.text}</div>
            </div>

            <div style={styles.stats}>
                {/* Gọi trực tiếp 3 thanh, không dùng map lồng bên ngoài nữa */}
                <ProgressBar label="Nhiệt độ" value={sensor?.temperature} type="temp" />
                <ProgressBar label="Độ pH" value={sensor?.ph} type="ph" />
                <ProgressBar label="Oxy hòa tan" value={sensor?.oxygen} type="oxygen" />
            </div>

            <div style={styles.footer}>
                <span style={styles.footerInfo}>Tạo: {new Date(pond.createdAt).toLocaleDateString('vi-VN')}</span>
                <div style={styles.actions}>
                    <motion.button
                        style={{
                            ...styles.detailBtn,
                            // Nếu Card đang Cảnh báo, nút sẽ sáng đỏ rực
                            background: isAlert ? 'rgba(239, 68, 68, 0.15)' : styles.detailBtn.background,
                            color: isAlert ? '#f87171' : styles.detailBtn.color,
                            borderColor: isAlert ? 'rgba(239, 68, 68, 0.5)' : styles.detailBtn.border,
                        }}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)',
                            boxShadow: isAlert
                                ? '0 0 20px rgba(239, 68, 68, 0.6)' // Phát sáng đỏ khi cảnh báo
                                : '0 0 20px rgba(56, 189, 248, 0.6)', // Phát sáng xanh khi bình thường
                            color: isAlert ? '#fff' : '#fff'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ponds/${pond.id}`);
                        }}
                    >
                        {isAlert ? '⚠️ Xử lý ngay' : 'Chi tiết →'}
                    </motion.button>
                    <button style={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(pond.id); }}>Xóa</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '16px 18px 12px'
    },
    name: { fontSize: '18px', fontWeight: '700', color: '#f8fafc' },
    location: { fontSize: '12px', color: '#888' },
    statusBadge: {
        fontSize: '12px',
        padding: '5px 14px',
        borderRadius: '20px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        border: '1px solid currentColor', // Viền cùng màu với chữ
        boxShadow: '0 0 10px currentColor', // Hiệu ứng phát sáng nhẹ
    },
    stats: {
        display: 'flex',
        flexDirection: 'column', // Chuyển sang hàng dọc để có không gian cho thanh Progress
        gap: '15px',
        padding: '20px'
    },
    stat: {
        width: '100%'
    },
    statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
    },
    progressBg: {
        width: '100%',
        height: '8px', // Dày hơn chút
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px',
        marginTop: '8px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    progressFill: {
        height: '100%',
        borderRadius: '10px',
        transition: 'width 1s ease-in-out', // Hiệu ứng chạy thanh khi load dữ liệu
        boxShadow: '0 0 10px currentColor' // Làm thanh progress phát sáng
    },
    statLabel: {
        fontSize: '16px',
        color: '#888',
        marginBottom: '4px'
    },
    statVal: { fontSize: '20px', fontWeight: '700', marginTop: '4px' },
    unit: { fontSize: '16px', color: '#64748b', fontWeight: '400' },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.03)', // Nền tối nhẹ thay vì màu trắng #f8f9fa
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px', // Bo tròn mềm mại hơn
        margin: '1px 10px 10px 10px'
    },
    footerInfo: { fontSize: '14px', color: '#64748b' },
    actions: { display: 'flex', gap: '8px' },
    // Nâng cấp Nút bấm: Glassy Button
    detailBtn: {
        padding: '10px 20px',
        background: 'rgba(56, 189, 248, 0.1)',
        color: '#38bdf8',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition cho hiệu ứng sáng
        backdropFilter: 'blur(4px)',
        position: 'relative',
        overflow: 'hidden', // Để giữ tia sáng bên trong nút nếu muốn thêm hiệu ứng quét
    },
    deleteBtn: {
        padding: '10px 16px',
        background: 'transparent',
        color: 'rgba(239, 68, 68, 0.6)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    progressWrapper: {
        position: 'relative',
        marginBottom: '15px',
        cursor: 'help'
    },
    track: {
        height: '8px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        position: 'relative',
    },
    bar: {
        height: '100%',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
    },

    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%) translateY(0)',
        background: '#1e293b',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        opacity: 0,
        visibility: 'hidden',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 10,
    }
};