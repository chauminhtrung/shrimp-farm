import { useState, useEffect, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import moment from 'moment';

// ĐÃ FIX: Key phải khớp với dữ liệu từ API (temperature, ph, oxygen, turbidity)
const METRICS = [
    { key: 'temperature', label: 'Nhiệt độ (°C)', color: '#ff2d55' }, // Neon Pink
    { key: 'ph', label: 'pH', color: '#22d3ee' }, // Neon Cyan
    { key: 'oxygen', label: 'Oxy (mg/L)', color: '#34c759' }, // Neon Green
    { key: 'turbidity', label: 'Độ đục (NTU)', color: '#fbbf24' }, // Neon Amber
];


// ĐÃ CHỈNH: Tooltip luôn hiện 4 dòng và màu chữ cực sáng
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const dataPoint = payload[0].payload;

    // Format lại label (thời gian) cho đẹp
    // Ví dụ: 15:34:41 - 10/05/2026
    const formattedTime = label 
        ? new Date(label).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }) + ' - ' + new Date(label).toLocaleDateString('vi-VN')
        : '--:--:--';

    return (
        <div style={styles.tooltipContainer}>
            {/* Header hiển thị thời gian đã format */}
            <div style={styles.tooltipHeader}>
                <span style={{ color: '#22d3ee' }}>🕒</span> {formattedTime}
            </div>
            
            {METRICS.map((m) => {
                const val = dataPoint[m.key];
                return (
                    <div key={m.key} style={styles.tooltipItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={styles.tooltipDot(m.color)} />
                            <span style={{ color: '#cbd5e1' }}>{m.label}:</span>
                        </div>
                        <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px' }}>
                            {val !== null && val !== undefined ? val : '--'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
export default function SensorChart({ pondId }) {
    const [data, setData] = useState([]);
    // ĐÃ FIX: Kích hoạt cả 4 key chính xác
    const [activeMetrics, setActiveMetrics] = useState(['temperature', 'ph', 'oxygen', 'turbidity']);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(24);
    const [lastUpdate, setLastUpdate] = useState('');

    const fetchHistory = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await api.get(`/api/sensor/history/${pondId}`);
            const raw = res.data;
            const limit = range === 24 ? 48 : range === 12 ? 24 : 12;
            const sliced = raw.slice(0, limit).reverse();

            const formatted = sliced.map(d => ({
                // GIỮ NGUYÊN recordedAt để XAxis và Tooltip dùng
                recordedAt: d.recordedAt,
                // Tạo thêm displayTime nếu muốn hiển thị rút gọn
                displayTime: new Date(d.recordedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                }),
                temperature: d.temperature ? parseFloat(d.temperature.toFixed(1)) : null,
                ph: d.ph ? parseFloat(d.ph.toFixed(2)) : null,
                oxygen: d.oxygen ? parseFloat(d.oxygen.toFixed(1)) : null,
                turbidity: d.turbidity ? parseFloat(d.turbidity.toFixed(1)) : null,
            }));
            setData(formatted);
            setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
        } catch {
            setData([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [pondId, range]);

    useEffect(() => { fetchHistory(true); }, [fetchHistory]);

    useEffect(() => {
        const interval = setInterval(() => { fetchHistory(false); }, 15000);
        return () => clearInterval(interval);
    }, [fetchHistory]);

    const toggleMetric = (key) => {
        setActiveMetrics(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    return (
        <div className="glass-panel" style={styles.card}>
            <div style={styles.header}>
                <div style={styles.titleRow}>
                    <span style={styles.title}>Biểu đồ dữ liệu sensor</span>
                    <div style={styles.liveIndicator}>
                        <span
                            className="animate-pulse-custom"
                            style={styles.liveDot}
                        />
                        <span style={styles.liveText}>TỰ ĐỘNG CẬP NHẬT 15S</span>
                    </div>
                </div>
                <div style={styles.rangeRow}>
                    {[6, 12, 24].map(r => (
                        <button
                            key={r}
                            style={{
                                ...styles.rangeBtn,
                                background: range === r ? '#22d3ee' : 'rgba(255,255,255,0.05)',
                                color: range === r ? '#020617' : '#94a3b8',
                                borderColor: range === r ? '#22d3ee' : 'rgba(255,255,255,0.1)'
                            }}
                            onClick={() => setRange(r)}
                        >
                            {r} GIỜ
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.metricRow}>
                {METRICS.map(m => (
                    <button
                        key={m.key}
                        style={{
                            ...styles.metricBtn,
                            background: activeMetrics.includes(m.key) ? `${m.color}22` : 'rgba(255,255,255,0.03)',
                            color: activeMetrics.includes(m.key) ? m.color : '#475569',
                            borderColor: activeMetrics.includes(m.key) ? `${m.color}55` : 'transparent'
                        }}
                        onClick={() => toggleMetric(m.key)}
                    >
                        <span
                            // THÊM DÒNG NÀY: Chỉ nhấp nháy khi đang active
                            className={activeMetrics.includes(m.key) ? "pulse-active" : ""}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: activeMetrics.includes(m.key) ? m.color : '#475569',
                                marginRight: '8px',
                                // Thêm hiệu ứng đổ bóng phát sáng rực hơn khi active
                                boxShadow: activeMetrics.includes(m.key) ? `0 0 10px ${m.color}` : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                        {m.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={styles.loading}>ĐANG TRUY XUẤT DỮ LIỆU...</div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="recordedAt" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: '600' }} axisLine={false} tickLine={false} dy={10} tickFormatter={(time) => {
                            if (!time) return "";
                            // Hiển thị cả giây để phân biệt các điểm dữ liệu sát nhau
                            return new Date(time).toLocaleTimeString('vi-VN', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            });
                        }} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: '600' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                        {METRICS.filter(m => activeMetrics.includes(m.key)).map(m => (
                            <Line
                                key={m.key}
                                type="monotone"
                                dataKey={m.key}
                                stroke={m.color}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: m.color }}
                                connectNulls
                                isAnimationActive={true}
                                animationBegin={300}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}

            <div style={styles.footer}>
                Cập nhật lần cuối: {lastUpdate} • {data.length} điểm dữ liệu
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '24px', borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap' },
    titleRow: { display: 'flex', alignItems: 'center', gap: '15px' },
    title: { fontSize: '18px', fontWeight: '800', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '1px' },
    liveIndicator: {
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(34, 211, 238, 0.1)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(34, 211, 238, 0.2)'
    },
    liveDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' },
    liveText: { fontSize: '12px', color: '#22d3ee', fontWeight: '900' },
    rangeRow: { display: 'flex', gap: '8px' },
    rangeBtn: { padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', border: '1px solid' },
    metricRow: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
    metricBtn: { padding: '8px 16px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', fontWeight: '700', border: '1px solid', display: 'flex', alignItems: 'center' },
    tooltipContainer: {
        background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(34, 211, 238, 0.3)',
        padding: '15px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)'
    },
    tooltipHeader: { color: '#94a3b8', fontSize: '12px', fontWeight: '800', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '8px' },
    tooltipItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '8px' },
    tooltipDot: (color) => ({ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }),
    loading: { height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '16px', fontWeight: '700' },
    footer: { fontSize: '12px', color: '#475569', textAlign: 'right', marginTop: '15px', fontWeight: '600' }
};