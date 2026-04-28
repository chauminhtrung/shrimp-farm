export default function AIPanel({ prediction }) {
    const getRiskColor = (level) => {
        if (level === 'HIGH') return { color: '#E24B4A', bg: '#FCEBEB' };
        if (level === 'MEDIUM') return { color: '#BA7517', bg: '#FAEEDA' };
        if (level === 'LOW') return { color: '#1D9E75', bg: '#E1F5EE' };
        return { color: '#888', bg: '#f5f5f5' };
    };

    const riskColor = getRiskColor(prediction?.riskLevel);

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.title}>🤖 AI Dự đoán</span>
                {prediction && (
                    <span style={{
                        ...styles.badge,
                        background: riskColor.bg,
                        color: riskColor.color
                    }}>
                        {prediction.riskLevel === 'HIGH' ? 'Nguy cơ cao' :
                         prediction.riskLevel === 'MEDIUM' ? 'Nguy cơ TB' :
                         prediction.riskLevel === 'LOW' ? 'Nguy cơ thấp' : 'Chưa rõ'}
                    </span>
                )}
            </div>

            {!prediction ? (
                <div style={styles.empty}>
                    Nhấn "Chạy AI dự đoán" để phân tích môi trường ao
                </div>
            ) : (
                <>
                    <div style={styles.riskRow}>
                        <span style={styles.riskLabel}>Nguy cơ dịch bệnh</span>
                        <span style={{
                            ...styles.riskPct,
                            color: riskColor.color
                        }}>
                            {prediction.riskPercent}%
                        </span>
                    </div>
                    <div style={styles.barBg}>
                        <div style={{
                            ...styles.barFill,
                            width: `${prediction.riskPercent}%`,
                            background: riskColor.color
                        }} />
                    </div>
                    <div style={{
                        ...styles.recommendation,
                        background: riskColor.bg,
                        color: riskColor.color
                    }}>
                        {prediction.recommendation}
                    </div>
                    <div style={styles.time}>
                        Dự đoán lúc: {new Date(prediction.predictedAt)
                            .toLocaleString('vi-VN')}
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    card: {
        background: '#fff', borderRadius: '12px',
        padding: '16px', border: '1px solid #e8e8e8'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px'
    },
    title: { fontSize: '13px', fontWeight: '600', color: '#1a1a1a' },
    badge: {
        fontSize: '11px', padding: '3px 9px',
        borderRadius: '20px', fontWeight: '500'
    },
    empty: {
        fontSize: '12px', color: '#aaa',
        textAlign: 'center', padding: '16px 0'
    },
    riskRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '6px'
    },
    riskLabel: { fontSize: '12px', color: '#666' },
    riskPct: { fontSize: '20px', fontWeight: '600' },
    barBg: {
        height: '6px', background: '#f0f0f0',
        borderRadius: '3px', overflow: 'hidden', marginBottom: '10px'
    },
    barFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s' },
    recommendation: {
        fontSize: '12px', padding: '8px 10px',
        borderRadius: '6px', lineHeight: 1.6, marginBottom: '8px'
    },
    time: { fontSize: '11px', color: '#bbb' }
};