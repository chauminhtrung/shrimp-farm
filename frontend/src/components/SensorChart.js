import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const METRICS = [
    { key: 'temperature', label: 'Nhiệt độ (°C)',  color: '#E24B4A', unit: '°C' },
    { key: 'ph',          label: 'pH',              color: '#185FA5', unit: '' },
    { key: 'oxygen',      label: 'Oxy (mg/L)',      color: '#1D9E75', unit: 'mg/L' },
    { key: 'turbidity',   label: 'Độ đục (NTU)',    color: '#BA7517', unit: 'NTU' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#fff', border: '1px solid #e8e8e8',
            borderRadius: '8px', padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'
        }}>
            <div style={{ fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                {label}
            </div>
            {payload.map((p, i) => (
                <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    gap: '16px', color: p.color, marginBottom: '2px'
                }}>
                    <span>{p.name}</span>
                    <span style={{ fontWeight: '600' }}>{p.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function SensorChart({ pondId }) {
    const [data, setData] = useState([]);
    const [activeMetrics, setActiveMetrics] = useState(['temperature', 'ph', 'oxygen']);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(24); // giờ gần nhất

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/sensor/history/${pondId}`);
                const raw = res.data;

                // Lấy số bản ghi theo range
                const limit = range === 24 ? 48 : range === 12 ? 24 : 12;
                const sliced = raw.slice(0, limit).reverse();

                const formatted = sliced.map(d => ({
                    time: new Date(d.recordedAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    temperature: d.temperature ? parseFloat(d.temperature.toFixed(1)) : null,
                    ph:          d.ph          ? parseFloat(d.ph.toFixed(2))          : null,
                    oxygen:      d.oxygen      ? parseFloat(d.oxygen.toFixed(1))      : null,
                    turbidity:   d.turbidity   ? parseFloat(d.turbidity.toFixed(1))   : null,
                }));

                setData(formatted);
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [pondId, range]);

    const toggleMetric = (key) => {
        setActiveMetrics(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.title}>📈 Biểu đồ dữ liệu sensor</span>
                <div style={styles.controls}>
                    {/* Range selector */}
                    <div style={styles.rangeRow}>
                        {[
                            { val: 6,  label: '6h' },
                            { val: 12, label: '12h' },
                            { val: 24, label: '24h' },
                        ].map(r => (
                            <button
                                key={r.val}
                                style={{
                                    ...styles.rangeBtn,
                                    background: range === r.val ? '#185FA5' : '#fff',
                                    color: range === r.val ? '#fff' : '#555',
                                    borderColor: range === r.val ? '#185FA5' : '#ddd'
                                }}
                                onClick={() => setRange(r.val)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metric toggles */}
            <div style={styles.metricRow}>
                {METRICS.map(m => (
                    <button
                        key={m.key}
                        style={{
                            ...styles.metricBtn,
                            background: activeMetrics.includes(m.key)
                                ? m.color + '18' : '#f5f5f5',
                            color: activeMetrics.includes(m.key) ? m.color : '#999',
                            borderColor: activeMetrics.includes(m.key)
                                ? m.color + '60' : '#e8e8e8'
                        }}
                        onClick={() => toggleMetric(m.key)}
                    >
                        <span style={{
                            display: 'inline-block',
                            width: '8px', height: '8px',
                            borderRadius: '50%',
                            background: activeMetrics.includes(m.key) ? m.color : '#ccc',
                            marginRight: '5px'
                        }} />
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            {loading ? (
                <div style={styles.loading}>Đang tải dữ liệu...</div>
            ) : data.length === 0 ? (
                <div style={styles.empty}>
                    Chưa có dữ liệu sensor. Hãy chạy IoT Simulator để có dữ liệu.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 11, fill: '#aaa' }}
                            tickLine={false}
                            axisLine={{ stroke: '#f0f0f0' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#aaa' }}
                            tickLine={false}
                            axisLine={false}
                            width={32}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {METRICS.filter(m => activeMetrics.includes(m.key)).map(m => (
                            <Line
                                key={m.key}
                                type="monotone"
                                dataKey={m.key}
                                name={m.label}
                                stroke={m.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}

            <div style={styles.footer}>
                Dữ liệu {range}h gần nhất · {data.length} điểm đo
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', padding: '16px',
        marginBottom: '14px'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px'
    },
    title: { fontSize: '13px', fontWeight: '600', color: '#1a1a1a' },
    controls: { display: 'flex', gap: '8px', alignItems: 'center' },
    rangeRow: { display: 'flex', gap: '4px' },
    rangeBtn: {
        padding: '4px 10px', border: '1px solid',
        borderRadius: '6px', fontSize: '11px',
        cursor: 'pointer', fontWeight: '500'
    },
    metricRow: {
        display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px'
    },
    metricBtn: {
        padding: '4px 10px', border: '1px solid',
        borderRadius: '20px', fontSize: '11px',
        cursor: 'pointer', fontWeight: '500',
        display: 'flex', alignItems: 'center'
    },
    loading: {
        height: '260px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#888', fontSize: '13px'
    },
    empty: {
        height: '200px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#aaa', fontSize: '13px', textAlign: 'center',
        padding: '20px'
    },
    footer: {
        fontSize: '11px', color: '#bbb',
        textAlign: 'right', marginTop: '8px'
    }
};