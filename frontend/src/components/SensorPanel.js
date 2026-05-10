import React from 'react';

export default function SensorPanel({ sensorData }) {
    // Bên trong component SensorPanel
    // Sử dụng state để đảm bảo giao diện cập nhật ngay khi resize
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const sensors = [
        {
            label: 'Nhiệt độ',
            value: sensorData?.temperature,
            unit: '°C',
            min: 25, max: 32,
            icon: '🌡️'
        },
        {
            label: 'pH',
            value: sensorData?.ph,
            unit: '',
            min: 6.5, max: 8.5,
            icon: '⚗️'
        },
        {
            label: 'Oxy hòa tan',
            value: sensorData?.oxygen,
            unit: ' mg/L',
            min: 4, max: 10,
            icon: '💧'
        },
        {
            label: 'Độ đục',
            value: sensorData?.turbidity,
            unit: ' NTU',
            min: 0, max: 5,
            icon: '🌊'
        }
    ];
    const styles = {
        row: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', // QUAN TRỌNG: 2 cột trên mobile
            gap: isMobile ? '10px' : '15px',
        },
        card: {
            background: 'rgba(15, 23, 42, 0.7)',
            padding: isMobile ? '12px' : '16px 18px', // Giảm padding trên mobile
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: isMobile ? '110px' : '135px', // Giảm chiều cao tối thiểu
            justifyContent: 'space-between',
            overflow: 'hidden' // Chống tràn nội dung
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Đẩy labelGroup sang trái, badge sang phải
            width: '100%',
            marginBottom: '4px'
        },
        labelGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px' // Khoảng cách giữa icon và chữ
        },
        icon: { fontSize: '22px' }, // Tăng cỡ icon một chút
        label: {
            fontSize: isMobile ? '10px' : '15px', // Nhãn nhỏ hơn trên mobile
            color: '#f8fafc',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
        badge: {
            fontSize: isMobile ? '10px' : '12px', // Badge nhỏ hơn
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '800',
            whiteSpace: 'nowrap'
        },
        valueContainer: {
            display: 'flex',
            alignItems: 'baseline',
            margin: '4px 0'
        },
        value: {
            fontSize: isMobile ? '24px' : '34px', // QUAN TRỌNG: Chữ số nhỏ hơn để không vỡ dòng
            fontWeight: '900',
            lineHeight: 1
        },
        unit: {
            fontSize: '14px',
            color: '#64748b',
            marginLeft: '4px'
        },
        range: {
            fontSize: isMobile ? '9px' : '11px', // Ngưỡng an toàn nhỏ lại
            color: '#94a3b8',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between'
        }
    };

    const getStatus = (val, min, max) => {
        if (!val) return { color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', text: 'Ngoại tuyến', };
        if (val < min || val > max)
            return { color: '#ff4d4d', bg: 'rgba(239, 68, 68, 0.15)', text: 'Vượt ngưỡng' };
        return { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.15)', text: 'Bình thường' };
    };

    return (
        <div style={styles.row}>
            {sensors.map((s, i) => {
                const status = getStatus(s.value, s.min, s.max);
                return (
                    <div key={i} className="glass-panel" style={styles.card}>
                        {/* Header: Đã được chỉnh sửa để Tên to ra và Badge sát phải */}
                        <div style={styles.cardHeader}>
                            <div style={styles.labelGroup}>
                                <span style={styles.icon}>{s.icon}</span>
                                <span style={styles.label}>{s.label}</span>
                            </div>
                            <span style={{
                                ...styles.badge,
                                background: status.bg,
                                color: status.color,
                                border: `1px solid ${status.color}33`
                            }}>
                                {s.value ? status.text : 'OFFLINE'}
                            </span>
                        </div>

                        <div style={styles.valueContainer}>
                            <div style={{
                                ...styles.value,
                                color: s.value ? status.color : '#475569',
                                textShadow: s.value ? `0 0 15px ${status.color}44` : 'none'
                            }}>
                                {s.value ? s.value.toFixed(1) : '--'}
                            </div>
                            <span style={styles.unit}>{s.unit}</span>
                        </div>

                        <div style={styles.range}>
                            <span>Ngưỡng an toàn:</span>
                            <span style={{ color: '#fff', fontWeight: isMobile ? '300' : '600'}}>{s.min} – {s.max}{s.unit}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

