import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PondCard({ pond, onDelete }) {
    const navigate = useNavigate();
    const [sensor, setSensor] = useState(null);
    // Hàm hỗ trợ tính phần trăm để hiển thị thanh Progress
    const getPercentage = (val, max) => Math.min(Math.max((val / max) * 100, 0), 100);

    // Thêm hiệu ứng nhấp nháy vào thẻ style của tài liệu
    const pulseStyle = `
  @keyframes alertPulse {
    0% { border-color: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.03); }
    50% { border-color: #f87171; box-shadow: 0 0 20px rgba(239, 68, 68, 0.7); background: rgba(239, 68, 68, 0.1); }
    100% { border-color: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.03); }
  }
`;


    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        const fetchSensor = async () => {
            try {
                const res = await api.get(`/api/sensor/latest/${pond.id}`);
                setSensor(res.data);
            } catch {
                setSensor(null);
            }
        };

        fetchSensor(); // gọi ngay lần đầu

        // Auto refresh mỗi 15 giây
        const interval = setInterval(fetchSensor, 15000);
        return () => clearInterval(interval);
    }, [pond.id]);

    const getStatusInfo = () => {
        if (!sensor) return { text: 'Chưa có dữ liệu', bg: 'rgba(255,255,255,0.05)', color: '#888' };

        // Logic này sẽ kích hoạt hiệu ứng nhấp nháy đỏ tự động:
        if (sensor.oxygen < 4.0 || sensor.ph > 8.5 || sensor.ph < 6.5)
            return { text: 'Cảnh báo', bg: '#fee2e2', color: '#ef4444' };

        return { text: 'Bình thường', bg: '#E1F5EE', color: '#085041' };
    };

    const status = getStatusInfo();

    const getValColor = (val, min, max) => {

        if (!val) return '#1a1a1a';

        if (val < min || val > max) return '#E24B4A';

        return '#1D9E75';

    };

    const getValGradient = (val, min, max) => {
        if (!val) return 'linear-gradient(90deg, #334155, #475569)';
        if (val < min || val > max)
            return 'linear-gradient(90deg, #f87171, #ef4444)'; // Đỏ cảnh báo
        return 'linear-gradient(90deg, #34d399, #10b981)'; // Xanh ổn định
    };


    const isAlert = status.text === 'Cảnh báo';
    return (
        <>
            <div style={{
                ...styles.card,
                // KÍCH HOẠT ANIMATION Ở ĐÂY
                animation: isAlert ? 'alertPulse 1.5s infinite' : 'none',

                // Cập nhật transform và border dựa trên cả Alert và Hover
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                borderColor: isAlert ? '#ef4444' : (isHovered ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
                boxShadow: isAlert
                    ? '0 0 20px rgba(239, 68, 68, 0.4)'
                    : (isHovered ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'),
                    
            }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                 onClick={() => navigate(`/ponds/${pond.id}`)}>
                <style>{pulseStyle}</style>
                <div style={styles.header}>
                    <div>
                        <div style={styles.name}>{pond.name}</div>
                        <div style={styles.location}>
                            📍 {pond.location || 'Chưa có vị trí'} · {pond.area || 0} m²
                        </div>
                    </div>
                    <div style={{
                        ...styles.statusBadge,
                        background: isAlert ? '#fee2e2' : status.bg,
                        color: isAlert ? '#ef4444' : status.color,
                        borderColor: isAlert ? '#ef4444' : 'currentColor'
                    }}>
                        {isAlert ? 'CẢNH BÁO' : status.text}
                    </div>
                </div>


                <div style={styles.stats}>
                    {[
                        { label: 'Nhiệt độ', val: sensor?.temperature, unit: '°C', max: 40, minRange: 25, maxRange: 32 },
                        { label: 'pH', val: sensor?.ph, unit: '', max: 14, minRange: 6.5, maxRange: 8.5 },
                        { label: 'Oxy', val: sensor?.oxygen, unit: 'mg/L', max: 12, minRange: 4, maxRange: 10 },
                    ].map((item, idx) => (
                        <div key={idx} style={styles.stat}>
                            <div style={styles.statHeader}>
                                <span style={styles.statLabel}>{item.label}</span>
                                <span style={{ ...styles.statVal, color: getValColor(item.val, item.minRange, item.maxRange) }}>
                                    {item.val?.toFixed(1) ?? '--'} <small style={styles.unit}>{item.unit}</small>
                                </span>
                            </div>
                            {/* Thanh Progress Bar */}
                            <div style={styles.progressBg}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${getPercentage(item.val || 0, item.max)}%`,
                                    background: getValGradient(item.val, item.minRange, item.maxRange), // Dùng Gradient ở đây
                                    boxShadow: `0 0 12px ${item.val < item.minRange || item.val > item.maxRange ? '#ef4444' : '#10b981'}`
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.footer}>
                    <span style={styles.footerInfo}>
                        Tạo lúc: {new Date(pond.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <div style={styles.actions}>
                        <button
                            style={{
                                ...styles.detailBtn,
                                // Nếu có cảnh báo, nút bấm sẽ có màu đỏ để gây chú ý
                                background: isAlert ? 'rgba(239, 68, 68, 0.2)' : (isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.1)'),
                                color: isAlert ? '#f87171' : (isHovered ? '#0f172a' : '#38bdf8'),
                                border: isAlert ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.3)',
                            }}
                            onClick={() => navigate(`/ponds/${pond.id}`)}
                        >
                            {isAlert ? '⚠️ Xử lý ngay' : '  Xem chi tiết →'}
                        </button>

                        <button
                            style={{
                                ...styles.deleteBtn,
                                borderColor: isHovered ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                                color: isHovered ? '#ef4444' : 'rgba(239, 68, 68, 0.4)'
                            }}
                            onClick={() => onDelete(pond.id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
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
        fontSize: '11px',
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
    unit: { fontSize: '10px', color: '#64748b', fontWeight: '400' },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.03)', // Nền tối nhẹ thay vì màu trắng #f8f9fa
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px', // Bo tròn mềm mại hơn
    },
    footerInfo: { fontSize: '14px', color: '#64748b' },
    actions: { display: 'flex', gap: '8px' },
    // Nâng cấp Nút bấm: Glassy Button
    detailBtn: {
        padding: '10px 20px',
        background: 'rgba(56, 189, 248, 0.1)', // Nền trong suốt màu xanh
        color: '#38bdf8',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(4px)',
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
    }
};