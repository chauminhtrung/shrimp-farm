import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PondCard from '../components/PondCard';
import CreatePondModal from '../components/CreatePondModal';
import DashboardHeader from "../components/DashboardHeader"
import { motion, AnimatePresence } from 'framer-motion';

export default function PondListPage() {
    const { user } = useAuth();
    const [ponds, setPonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [totalAlerts, setTotalAlerts] = useState(0);
    const [filterStatus, setFilterStatus] = useState('Tất cả');

    const [searchQuery, setSearchQuery] = useState('');




    const getStatus = (pond) => {
        const sensor = pond.latestSensor;
        if (!sensor) return 'Chưa có dữ liệu';

        // Logic cảnh báo (Trung có thể tùy chỉnh chỉ số này)
        const isAlert = sensor.oxygen < 4 || sensor.ph < 6.5 || sensor.ph > 8.5;
        return isAlert ? 'Cảnh báo' : 'Bình thường';
    };




    const countNormal = ponds.filter(p => getStatus(p) === 'Bình thường').length;
    const countAlert = ponds.filter(p => getStatus(p) === 'Cảnh báo').length;
    const countNoData = ponds.filter(p => getStatus(p) === 'Chưa có dữ liệu').length;

    const filteredPonds = ponds.filter(pond => {
        // Khớp theo Filter Chip (Trạng thái)
        const matchesStatus = filterStatus === 'Tất cả' || getStatus(pond) === filterStatus;

        // Khớp theo Search Query (Tên ao)
        const matchesSearch = pond.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const skeletonStyle = `
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
`;

    const emojiAnimation = `
  /* Keyframe này chỉ thay đổi độ nhòe và màu của bóng đổ, không làm icon cử động */
  @keyframes pureGlow {
    0% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
    50% { filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.7)); }
    100% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
  }
  
  @keyframes rotateHalo {
    /* Quan trọng: dùng translate(-50%, -50%) để vòng tròn luôn nằm giữa icon */
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;


    const PondSkeleton = () => (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '20px',
            height: '350px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Hiệu ứng mờ chạy qua (Shimmer) */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                animation: 'shimmer 1.5s infinite'
            }} />
            <style>
                {`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}
            </style>
        </div>
    );

    // Load danh sách ao
    const fetchPonds = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/ponds?userId=${user.userId}`);
            const pondList = res.data;

            // Gọi thêm API lấy sensor data cho từng ao
            const pondsWithSensor = await Promise.all(
                pondList.map(async (pond) => {
                    try {
                        const sensorRes = await api.get(`/api/sensor/latest/${pond.id}`);
                        return { ...pond, latestSensor: sensorRes.data };
                    } catch {
                        return { ...pond, latestSensor: null };
                    }
                })
            );

            setPonds(pondsWithSensor);
            fetchTotalAlerts(pondsWithSensor);
        } catch (err) {
            toast.error('Không thể tải danh sách ao');
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAlerts = async (pondList) => {
        try {
            let total = 0;
            await Promise.all(
                pondList.map(async (pond) => {
                    const res = await api.get(`/api/alerts/unread?pondId=${pond.id}`);
                    total += res.data.length;
                })
            );
            setTotalAlerts(total);
        } catch {
            setTotalAlerts(0);
        }
    };

    useEffect(() => {
        fetchPonds();

        // Auto refresh mỗi 15 giây
        const interval = setInterval(() => {
            fetchPonds();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // Tạo ao mới
    const handleCreate = async (formData) => {
        try {
            await api.post('/api/ponds', {
                ...formData,
                userId: user.userId
            });
            toast.success('Tạo ao thành công!');
            setShowModal(false);
            fetchPonds();
        } catch (err) {
            toast.error('Tạo ao thất bại');
        }
    };

    // Xóa ao
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa ao này?')) return;
        try {
            await api.delete(`/api/ponds/${id}`);
            toast.success('Đã xóa ao');
            fetchPonds();
        } catch (err) {
            toast.error('Xóa ao thất bại');
        }
    };



    return (
       <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={styles.page}
        >
            <Navbar />

            <div style={styles.container}>
                {/* Header */}
                <DashboardHeader
                    userName="Trung"
                    totalPonds={ponds.length}
                    alertPonds={ponds.filter(p => getStatus(p) === 'Cảnh báo').length}
                    onAddClick={() => setShowModal(true)}
                    searchQuery={searchQuery}          // Truyền state
                    onSearchChange={setSearchQuery}    // Truyền function cập nhật
                />

                <div style={styles.filterContainer}>
                    {['Tất cả', 'Bình thường', 'Cảnh báo', 'Chưa có dữ liệu'].map((status) => (
                        <button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                ...styles.filterChip,
                                ...(filterStatus === status ? styles.activeChip : styles.inactiveChip)
                            }}
                        >
                            {status}
                            <span style={styles.chipCount}>
                                {status === 'Tất cả' && ponds.length}
                                {status === 'Bình thường' && countNormal}
                                {status === 'Cảnh báo' && countAlert}
                                {status === 'Chưa có dữ liệu' && countNoData}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={styles.statsRow}>
                    {[
                        { label: 'Tổng số ao', value: ponds.length, color: '#38bdf8', icon: '🌊' },
                        { label: 'Đang hoạt động', value: ponds.length, color: '#22c55e', icon: '⚡' },
                        { label: 'Cảnh báo', value: totalAlerts, color: totalAlerts > 0 ? '#ef4444' : '#22c55e', icon: '⚠️' },
                    ].map((s, i) => (
                        <div key={i} style={styles.statCard}>
                            <div>
                                <div style={styles.statLabel}>{s.label}</div>
                                <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
                            </div>
                            <div style={styles.statIcon}>{s.icon}</div>
                        </div>
                    ))}
                </div>

                {/* Pond list */}
                <div style={styles.contentSection}>
                    {loading ? (
                        // 1. Trạng thái đang tải: Hiện khung xương (Skeleton)
                        <div style={styles.grid}>
                            {[...Array(6)].map((_, i) => <PondSkeleton key={i} />)}
                        </div>
                    ) : ponds.length === 0 ? (
                        // 2. Trạng thái trống: Hiện Empty State đẹp mắt
                        <div style={styles.emptyContainer}>
                            <div style={styles.emptyIllustration}>
                                <style>{emojiAnimation}</style>

                                {/* Vòng hào quang nét đứt xoay xung quanh */}
                                <div style={{
                                    ...styles.emptyCircle,
                                    animation: 'rotateHalo 12s linear infinite', // Xoay chậm rãi
                                    border: '2px dashed rgba(56, 189, 248, 0.2)',
                                    background: 'transparent', // Để nó chỉ là cái vòng xoay
                                }}></div>

                                {/* Lớp nền phát sáng mờ ảo nằm dưới icon */}
                                <div style={{
                                    ...styles.emptyCircle,
                                    width: '100px', height: '100px',
                                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                                    filter: 'blur(15px)',
                                    zIndex: 1
                                }}></div>

                                {/* Icon đứng yên 100%, chỉ có ánh sáng xung quanh thay đổi */}
                                <span style={{
                                    ...styles.emptyEmoji,
                                    animation: 'pureGlow 4s ease-in-out infinite', // Chỉ phát sáng, không scale
                                    display: 'inline-block',
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    🏝️
                                </span>
                            </div>
                            <h3 style={styles.emptyTitle}>Chưa có ao nuôi nào</h3>
                            <p style={styles.emptySubText}>
                                Có vẻ như bạn chưa bắt đầu. Hãy tạo ao nuôi đầu tiên <br />
                                để hệ thống có thể giúp bạn giám sát 24/7.
                            </p>
                            <button
                                style={styles.createBtnLarge}
                                onClick={() => setShowModal(true)}
                            >
                                🚀 Bắt đầu ngay
                            </button>
                        </div>
                    ) : (
                        // 3. Trạng thái có dữ liệu: Hiện danh sách ao
                        <div style={styles.grid}>
                            <AnimatePresence mode='popLayout'>
                                {filteredPonds.map((pond) => (
                                    <motion.div
                                        key={pond.id} // Quan trọng: key phải là duy nhất
                                        layout // Tự động di chuyển các card còn lại vào chỗ trống mượt mà
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }} // Trạng thái khi mới xuất hiện
                                        animate={{ opacity: 1, scale: 1, y: 0 }}    // Trạng thái hiển thị
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} // Khi bị lọc mất
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                            opacity: { duration: 0.2 }
                                        }}
                                    >
                                        <PondCard pond={pond} onDelete={handleDelete} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <CreatePondModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
    </motion.div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        padding: '40px 20px',
        // Hiệu ứng Gradient tạo chiều sâu
        background: `radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.5) 0%, transparent 40%),
                     radial-gradient(circle at 100% 100%, rgba(56, 189, 248, 0.3) 0%, transparent 40%),
                     #0f172a`,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',            // Kích hoạt flexbox
        justifyContent: 'space-between', // Đẩy tiêu đề sang trái, nút sang phải
        alignItems: 'flex-end',    // Căn cho nút nằm ngang hàng với dòng subtitle dưới cùng
        marginBottom: '30px',       // Khoảng cách với phần Stats bên dưới
        width: '100%'               // Đảm bảo header chiếm hết chiều ngang container
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px 30px 20px',

    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
        color: '#fff',
        letterSpacing: '-0.5px',
        margin: 0                   // Xóa margin mặc định để căn chỉnh chuẩn hơn
    },
    subtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        marginTop: '6px',
        marginBottom: 0
    },
    createBtn: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
        whiteSpace: 'nowrap',       // Đảm bảo chữ trong nút không bị xuống dòng
        height: 'fit-content'       // Nút tự co giãn theo nội dung
    },
    statsRow: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px', marginBottom: '20px'
    },
    // Thêm vào styles trong PondListPage.js
    statCard: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'row', // Đổi thành row để icon nằm bên cạnh số
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
    },
    statVal: {
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '4px',
        // Thêm hiệu ứng phát sáng cho con số
        textShadow: '0 0 15px currentColor',
    },
    statIcon: {
        fontSize: '30px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px',
        borderRadius: '15px',
        marginLeft: '15px'
    },
    statLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '14px'
    },
    loading: { textAlign: 'center', padding: '60px', color: '#888' },
    empty: {
        textAlign: 'center', padding: '60px',
        background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8'
    },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    emptyText: { fontSize: '15px', color: '#888', marginBottom: '16px' },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Tự động xuống hàng nếu màn hình nhỏ
        gap: '20px',
        marginBottom: '30px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Đảm bảo card có độ rộng hợp lý
        gap: '20px'
    },
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '30px',
        border: '1px dashed rgba(255, 255, 255, 0.1)', // Viền nét đứt tạo cảm giác "chỗ này đang đợi bạn điền vào"
        marginTop: '20px',
    },
    emptyIllustration: {
        position: 'relative',
        marginBottom: '24px',
    },
    emptyCircle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '140px', // To hơn emoji
        height: '140px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 1,
    },
    emptyEmoji: {
        fontSize: '80px', // Cho to hẳn lên nhìn rất "cuốn"
        userSelect: 'none',
    },
    emptyTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#f8fafc',
        margin: '0 0 12px 0',
    },
    emptySubText: {
        fontSize: '16px',
        color: '#94a3b8',
        lineHeight: '1.6',
        marginBottom: '32px',
    },
    createBtnLarge: {
        padding: '14px 32px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '15px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)',
        transition: 'all 0.3s ease',
    },
    filterContainer: {
        display: 'flex',
        gap: '12px',
        marginBottom: '25px',
        padding: '0 10px',
        flexWrap: 'wrap'
    },
    filterChip: {
        padding: '10px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backdropFilter: 'blur(10px)',
    },
    activeChip: {
        background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
        border: 'none',
    },
    inactiveChip: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#94a3b8',
    },
    chipCount: {
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '12px',
    }

};