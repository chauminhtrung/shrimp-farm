import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SensorPanel from '../components/SensorPanel';
import PondMap from '../components/PondMap';
import AIPanel from '../components/AIPanel';
import AlertPanel from '../components/AlertPanel';
import SensorChart from '../components/SensorChart';
export default function PondDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pond, setPond] = useState(null);
    const [sensorData, setSensorData] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartKey, setChartKey] = useState(0);

    // Thêm vào đầu component PondDetailPage
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    // Sửa trong đối tượng styles ở cuối file
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'flex-start', // Stretch để nút dài ra trên mobile
        flexDirection: isMobile ? 'column' : 'row',    // Xuống hàng trên mobile
        marginBottom: '20px',
        gap: '15px'
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


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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



    const handleMarkRead = async (alertId) => {
        try {
            // Bước 1: Cập nhật giao diện ngay lập tức cho người dùng sướng mắt
            setAlerts(prev => prev.map(a => a.id == alertId ? { ...a, isRead: true } : a));

            // Bước 2: GỬI LỆNH LƯU VÀO DATABASE (Cực kỳ quan trọng)
            // Lưu ý: Đường dẫn API này phải khớp với Back-end của bạn (ví dụ /api/alerts/read/:id)
            await api.put(`/api/alerts/${alertId}/read`);

            toast.success('Đã xác nhận xử lý');
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            toast.error('Không thể lưu trạng thái vào hệ thống');

            // Nếu lỗi thì phải fetch lại để trả về trạng thái cũ, tránh sai lệch dữ liệu
            fetchAlerts();
        }
    };

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
        const interval = setInterval(() => {
            fetchSensor();
            fetchAlerts();
            fetchPrediction();
            setChartKey(prev => prev + 1); // force SensorChart re-fetch
        }, 15000); // 15 giây thay vì 30
        return () => clearInterval(interval);
    }, [fetchAll, fetchSensor, fetchAlerts, fetchPrediction]);

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
        <div className="app-container">
            <Navbar />
            <div style={styles.container}>

                {/* Header - Giữ nguyên vị trí cũ */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <button className="modern-back-btn" onClick={() => navigate('/ponds')}>
                            ← Quay lại
                        </button>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>{pond?.name}</h1>
                            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                                📍 {pond?.location} · {pond?.area} m² · Cập nhật mỗi 15 giây
                            </p>
                        </div>
                    </div>
                    <button className="modern-predict-btn" onClick={handlePredict}>
                        🤖 Chạy AI dự đoán
                    </button>
                </div>

                {/* Row 1: Sensor - Giữ nguyên layout ngang trên cùng */}
                <div className="glass-panel" style={{ marginBottom: '20px' }}>
                    <SensorPanel sensorData={sensorData} />
                </div>

                {/* Chart - Giữ nguyên vị trí giữa */}
                <div className="glass-panel" style={{ marginBottom: '20px', padding: '15px' }}>
                    <SensorChart pondId={parseInt(id)} key={chartKey} />
                </div>

                {/* Row 2: Map + AI + Alert - Giữ nguyên 2 cột dưới cùng */}

                <div style={{
                    ...styles.row2,
                    // Nếu là mobile thì chuyển sang 1 cột, nếu desktop thì giữ grid 2 cột
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: 'column'
                }}>
                    <div className="glass-panel" style={{ padding: '10px' }}>
                        <PondMap pondId={parseInt(id)} pond={pond} />
                    </div>

                    <div style={{
                        ...styles.rightCol,
                        width: '100%' // Đảm bảo cột phải chiếm hết chiều ngang khi xuống hàng
                    }}>
                        <div className="glass-panel"><AIPanel prediction={prediction} /></div>
                        <AlertPanel alerts={alerts} onMarkRead={handleMarkRead} />
                    </div>
                </div>

            </div>
        </div>
    );
}

