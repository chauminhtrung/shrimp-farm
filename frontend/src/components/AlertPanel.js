export default function AlertPanel({ alerts, onMarkRead }) {
console.log("Danh sách hiện tại:", alerts.map(a => `${a.id}: ${a.isRead}`));
    // Tách mảng dữ liệu
    const unread = alerts.filter(a => !a.isRead);
    const read = alerts.filter(a => a.isRead);

    return (
        <div className="glass-panel" style={styles.card}>
            {/* HEADER */}
            <div style={styles.header}>
                <span style={styles.title}>🔔 HỆ THỐNG CẢNH BÁO</span>
                {unread.length > 0 && (
                    <span style={styles.countBadge}>{unread.length} MỚI</span>
                )}
            </div>

            <div style={styles.list}>
                {/* --- PHẦN 1: CẢNH BÁO CHƯA XỬ LÝ (Hiện lên đầu) --- */}
                {unread.map(alert => {
                    const isDanger = alert.level === 'DANGER';
                    const color = isDanger ? '#ff4d4d' : '#fbbf24';
                    
                    return (
                        <div key={alert.id} style={{
                            ...styles.item,
                            background: 'rgba(255,255,255,0.05)',
                            borderColor: `${color}44`,
                            borderLeft: `4px solid ${color}`
                        }}>
                            <div style={styles.itemContent}>
                                <div style={{ ...styles.msg, color: '#f8fafc' }}>
                                    {alert.message.split(/(\d+\.?\d*)/).map((part, i) => 
                                        /\d/.test(part) ? <b key={i} style={{ color: color, fontSize: '15px' }}>{part}</b> : part
                                    )}
                                </div>
                                <div style={styles.time}>{new Date(alert.createdAt).toLocaleString('vi-VN')}</div>
                            </div>
                            <button 
                                style={{ ...styles.readBtn, color: color, borderColor: `${color}66` }} 
                                onClick={() => onMarkRead(alert.id)}
                            >
                                ĐÃ XỬ LÝ
                            </button>
                        </div>
                    );
                })}

                {/* --- KHOẢNG CÁCH GIỮA 2 PHẦN --- */}
                {read.length > 0 && unread.length > 0 && (
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
                )}

                {/* --- PHẦN 2: LỊCH SỬ ĐÃ XỬ LÝ (Mờ đi và ẩn nút) --- */}
                {read.slice(0, 3).map(alert => ( // Chỉ hiện 3 cái gần nhất cho gọn
                    <div key={alert.id} style={{
                        ...styles.item,
                        background: 'rgba(255,255,255,0.01)',
                        borderColor: 'transparent',
                        opacity: 0.4,
                    }}>
                        <div style={styles.itemContent}>
                            <div style={{ ...styles.msg, color: '#94a3b8', textDecoration: 'line-through' }}>
                                {alert.message}
                            </div>
                            <div style={styles.time}>Hoàn tất: {new Date(alert.createdAt).toLocaleTimeString('vi-VN')}</div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>✓ XONG</span>
                    </div>
                ))}

                {/* TRƯỜNG HỢP TRỐNG */}
                {alerts.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '20px' }}>
                        Không có cảnh báo nào.
                    </div>
                )}
            </div>
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
        color: '#f8fafc'
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
    },
    title: { 
        fontSize: '15px', 
        fontWeight: '800', 
        color: '#f8fafc', 
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
    },
    countBadge: { 
        fontSize: '11px', 
        color: '#ff4d4d', 
        background: 'rgba(255, 77, 77, 0.15)', 
        padding: '3px 10px', 
        borderRadius: '20px', 
        border: '1px solid rgba(255, 77, 77, 0.3)',
        fontWeight: '800'
    },
    list: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        maxHeight: '400px', // Thêm cuộn nếu quá nhiều cảnh báo
        overflowY: 'auto',
        paddingRight: '5px'
    },
    item: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        padding: '14px', 
        borderRadius: '12px', 
        border: '1px solid', 
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    itemContent: { flex: 1 },
    msg: { 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '6px',
        lineHeight: 1.4
    },
    time: { 
        fontSize: '11px', 
        color: '#64748b',
        fontWeight: '500'
    },
    readBtn: { 
        background: 'rgba(255,255,255,0.07)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        padding: '8px 15px', 
        borderRadius: '8px', 
        fontSize: '10px', 
        fontWeight: '900', 
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    }
};