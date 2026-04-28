export default function AlertPanel({ alerts, onMarkRead }) {
    const unread = alerts.filter(a => !a.isRead);

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.title}>🔔 Cảnh báo</span>
                {unread.length > 0 && (
                    <span style={styles.badge}>{unread.length} mới</span>
                )}
            </div>

            {alerts.length === 0 ? (
                <div style={styles.empty}>Không có cảnh báo nào</div>
            ) : (
                <div style={styles.list}>
                    {alerts.slice(0, 5).map(alert => (
                        <div key={alert.id} style={{
                            ...styles.item,
                            background: alert.isRead ? '#fafafa' : '#fff'
                        }}>
                            <div style={{
                                ...styles.dot,
                                background: alert.level === 'DANGER'
                                    ? '#E24B4A' : '#BA7517'
                            }} />
                            <div style={styles.itemContent}>
                                <div style={styles.msg}>{alert.message}</div>
                                <div style={styles.time}>
                                    {new Date(alert.createdAt)
                                        .toLocaleString('vi-VN')}
                                </div>
                            </div>
                            {!alert.isRead && (
                                <button
                                    style={styles.readBtn}
                                    onClick={() => onMarkRead(alert.id)}
                                >
                                    ✓
                                </button>
                            )}
                        </div>
                    ))}
                </div>
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
        fontSize: '11px', padding: '2px 8px',
        borderRadius: '20px', background: '#FCEBEB',
        color: '#E24B4A', fontWeight: '500'
    },
    empty: {
        fontSize: '12px', color: '#aaa',
        textAlign: 'center', padding: '12px 0'
    },
    list: { display: 'flex', flexDirection: 'column', gap: '6px' },
    item: {
        display: 'flex', alignItems: 'flex-start', gap: '8px',
        padding: '8px', borderRadius: '6px', border: '1px solid #f0f0f0'
    },
    dot: {
        width: '7px', height: '7px', borderRadius: '50%',
        marginTop: '4px', flexShrink: 0
    },
    itemContent: { flex: 1 },
    msg: { fontSize: '12px', color: '#333', lineHeight: 1.5 },
    time: { fontSize: '11px', color: '#bbb', marginTop: '2px' },
    readBtn: {
        background: 'none', border: 'none',
        color: '#1D9E75', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600'
    }
};