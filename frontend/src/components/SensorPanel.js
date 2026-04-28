export default function SensorPanel({ sensorData }) {
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

    const getStatus = (val, min, max) => {
        if (!val) return { color: '#888', bg: '#f5f5f5', text: '—' };
        if (val < min || val > max)
            return { color: '#E24B4A', bg: '#FCEBEB', text: 'Vượt ngưỡng' };
        return { color: '#1D9E75', bg: '#E1F5EE', text: 'Bình thường' };
    };

    return (
        <div style={styles.row}>
            {sensors.map((s, i) => {
                const status = getStatus(s.value, s.min, s.max);
                return (
                    <div key={i} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.icon}>{s.icon}</span>
                            <span style={styles.label}>{s.label}</span>
                            <span style={{
                                ...styles.badge,
                                background: status.bg,
                                color: status.color
                            }}>
                                {s.value ? status.text : 'Chưa có dữ liệu'}
                            </span>
                        </div>
                        <div style={{ ...styles.value, color: status.color }}>
                            {s.value ? s.value.toFixed(1) : '--'}
                            <span style={styles.unit}>{s.unit}</span>
                        </div>
                        <div style={styles.range}>
                            Ngưỡng: {s.min} – {s.max}{s.unit}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px', marginBottom: '14px'
    },
    card: {
        background: '#fff', borderRadius: '12px',
        padding: '16px', border: '1px solid #e8e8e8'
    },
    cardHeader: {
        display: 'flex', alignItems: 'center',
        gap: '6px', marginBottom: '10px'
    },
    icon: { fontSize: '16px' },
    label: { fontSize: '12px', color: '#666', flex: 1 },
    badge: {
        fontSize: '10px', padding: '2px 7px',
        borderRadius: '20px', fontWeight: '500'
    },
    value: {
        fontSize: '28px', fontWeight: '600',
        lineHeight: 1, marginBottom: '6px'
    },
    unit: { fontSize: '13px', fontWeight: '400', marginLeft: '2px' },
    range: { fontSize: '11px', color: '#aaa' }
};