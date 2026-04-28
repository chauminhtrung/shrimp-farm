import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SensorPanel from '../components/SensorPanel';
import PondMap from '../components/PondMap';
import AIPanel from '../components/AIPanel';
import AlertPanel from '../components/AlertPanel';

export default function PondDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pond, setPond] = useState(null);
    const [sensorData, setSensorData] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load pond info
    const fetchPond = useCallback(async () => {
        try {
            const res = await api.get(`/api/ponds/${id}`);
            setPond(res.data);
        } catch {
            toast.error('Không tìm thấy ao');
            navigate('/ponds');
        }
    }, [id]);

    // Load sensor data mới nhất
    const fetchSensor = useCallback(async () => {
        try {
            const res = await api.get(`/api/sensor/latest/${id}`);
            setSensorData(res.data);
        } catch {
            setSensorData(null);
        }
    }, [id]);

    // Load AI prediction mới nhất
    const fetchPrediction = useCallback(async () => {
        try {
            const res = await api.get(`/api/predict/latest/${id}`);
            setPrediction(res.data);
        } catch {
            setPrediction(null);
        }
    }, [id]);

    // Load alerts
    const fetchAlerts = useCallback(async () => {
        try {
            const res = await api.get(`/api/alerts?pondId=${id}`);
            setAlerts(res.data);
        } catch {
            setAlerts([]);
        }
    }, [id]);

    // Load tất cả data
    const fetchAll = useCallback(async () => {
        await Promise.all([
            fetchPond(),
            fetchSensor(),
            fetchPrediction(),
            fetchAlerts()
        ]);
        setLoading(false);
    }, [fetchPond, fetchSensor, fetchPrediction, fetchAlerts]);

    useEffect(() => {
        fetchAll();
        // Auto refresh mỗi 30 giây
        const interval = setInterval(() => {
            fetchSensor();
            fetchAlerts();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchAll, fetchSensor, fetchAlerts]);

    // Gọi AI dự đoán thủ công
    const handlePredict = async () => {
        if (!sensorData) {
            toast.error('Chưa có dữ liệu sensor để dự đoán');
            return;
        }
        try {
            await api.post('/api/predict', {
                pondId: parseInt(id),
                ph: sensorData.ph,
                temperature: sensorData.temperature,
                oxygen: sensorData.oxygen
            });
            toast.success('Đã cập nhật dự đoán AI');
            fetchPrediction();
        } catch {
            toast.error('Dự đoán thất bại');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
                Đang tải...
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Navbar />
            <div style={styles.container}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <button
                            style={styles.backBtn}
                            onClick={() => navigate('/ponds')}
                        >
                            ← Quay lại
                        </button>
                        <div>
                            <h1 style={styles.title}>
                                {pond?.name}
                            </h1>
                            <p style={styles.subtitle}>
                                📍 {pond?.location || 'Chưa có vị trí'} ·
                                {pond?.area || 0} m² ·
                                Cập nhật mỗi 30 giây
                            </p>
                        </div>
                    </div>
                    <button style={styles.predictBtn} onClick={handlePredict}>
                        🤖 Chạy AI dự đoán
                    </button>
                </div>

                {/* Row 1: Sensor */}
                <SensorPanel sensorData={sensorData} />

                {/* Row 2: Pond Map + AI + Alert */}
                <div style={styles.row2}>
                    <div style={styles.leftCol}>
                        <PondMap pondId={parseInt(id)} pond={pond} />
                    </div>
                    <div style={styles.rightCol}>
                        <AIPanel prediction={prediction} />
                        <AlertPanel
                            alerts={alerts}
                            onMarkRead={async (alertId) => {
                                await api.put(`/api/alerts/${alertId}/read`);
                                fetchAlerts();
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '20px'
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    backBtn: {
        padding: '6px 14px', background: '#E6F1FB',
        color: '#185FA5', border: '1px solid #B5D4F4',
        borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
    },
    title: { fontSize: '20px', fontWeight: '600', color: '#1a1a1a' },
    subtitle: { fontSize: '12px', color: '#888', marginTop: '3px' },
    predictBtn: {
        padding: '9px 18px', background: '#534AB7',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '500', cursor: 'pointer'
    },
    row2: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' },
    leftCol: {},
    rightCol: { display: 'flex', flexDirection: 'column', gap: '14px' }
};