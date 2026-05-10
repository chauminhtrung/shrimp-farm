export default function AIPanel({ prediction }) {
    const getRiskStyles = (level) => {
        if (level === 'HIGH') return { color: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.15)', glow: '0 0 15px rgba(255, 77, 77, 0.4)' };
        if (level === 'MEDIUM') return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', glow: '0 0 15px rgba(251, 191, 36, 0.3)' };
        return { color: '#34c759', bg: 'rgba(52, 199, 89, 0.15)', glow: '0 0 15px rgba(52, 199, 89, 0.3)' };
    };

    const risk = getRiskStyles(prediction?.riskLevel);

    return (
        <div className="glass-panel" style={styles.card}>
            <div style={styles.header}>
                <span style={styles.title}>🤖 TRÍ TUỆ NHÂN TẠO</span>
                {prediction && (
                    <span style={{ 
                        ...styles.badge, 
                        background: risk.bg, 
                        color: risk.color,
                        boxShadow: risk.glow,
                        border: `1px solid ${risk.color}55`
                    }}>
                        {prediction.riskLevel === 'HIGH' ? 'NGUY CƠ CAO' : 'AN TOÀN'}
                    </span>
                )}
            </div>

            {prediction && (
                <>
                    <div style={styles.riskRow}>
                        <span style={styles.riskLabel}>Khả năng xảy ra dịch bệnh</span>
                        <span style={{ ...styles.riskPct, color: risk.color, textShadow: risk.glow }}>
                            {prediction.riskPercent}%
                        </span>
                    </div>
                    
                    <div style={styles.barBg}>
                        <div style={{ 
                            ...styles.barFill, 
                            width: `${prediction.riskPercent}%`, 
                            background: `linear-gradient(90deg, transparent, ${risk.color})`,
                            boxShadow: `0 0 10px ${risk.color}`
                        }} />
                    </div>

                    <div style={{ ...styles.recommendation, borderLeft: `4px solid ${risk.color}`, background: 'rgba(255,255,255,0.03)' }}>
                        <strong style={{ color: risk.color, display: 'block', marginBottom: '4px' }}>KHUYẾN NGHỊ:</strong>
                        {prediction.recommendation}
                    </div>
                    
                    <div style={styles.time}>Cập nhật cuối: {new Date(prediction.predictedAt).toLocaleTimeString('vi-VN')}</div>
                </>
            )}
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(15, 23, 42, 0.6)', 
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        color: '#f8fafc',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px' 
    },
    title: { 
        fontSize: '15px', 
        fontWeight: '800', 
        color: '#f8fafc', 
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
    },
    badge: { 
        fontSize: '12px', 
        padding: '5px 12px', 
        borderRadius: '6px', 
        fontWeight: '900',
        letterSpacing: '0.5px'
    },
    riskRow: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '10px' 
    },
    riskLabel: { 
        fontSize: '14px', 
        color: '#cbd5e1',
        fontWeight: '500'
    },
    riskPct: { 
        fontSize: '36px', 
        fontWeight: '900', 
        lineHeight: 0.8,
        fontFamily: 'monospace' // Nhìn cho giống máy tính tính toán
    },
    barBg: { 
        height: '10px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '10px', 
        overflow: 'hidden', 
        marginBottom: '25px',
        border: '1px solid rgba(255,255,255,0.03)'
    },
    barFill: { 
        height: '100%', 
        borderRadius: '10px', 
        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' 
    },
    recommendation: { 
        fontSize: '14px', 
        padding: '15px', 
        borderRadius: '12px', 
        lineHeight: 1.6, 
        color: '#e2e8f0',
        marginBottom: '15px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
    },
    time: { 
        fontSize: '11px', 
        color: '#64748b',
        textAlign: 'right',
        fontStyle: 'italic'
    }
};