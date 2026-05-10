import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Image } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import api from '../services/api';
import toast from 'react-hot-toast';
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 600;
const isMobile = getIsMobile(); // Thêm dòng này để gán giá trị cho biến

const DeviceRipple = ({ x, y, isEnabled, color }) => {
    const ringRef = useRef();
    useEffect(() => {
        if (!isEnabled) return;
        const anim = new Konva.Animation((frame) => {
            if (!ringRef.current) return;
            const scale = (frame.time % 2000) / 2000;
            ringRef.current.scale({ x: 1 + scale * 2, y: 1 + scale * 2 });
            ringRef.current.opacity(0.8 * (1 - scale));
        }, ringRef.current.getLayer());
        anim.start();
        return () => anim.stop();
    }, [isEnabled]);

    if (!isEnabled) return null;
    return (
        <Circle
            ref={ringRef}
            x={x} y={y}
            radius={15}
            stroke={color}
            strokeWidth={1}
            listening={false}
        />
    );
};

export default function PondMap({ pondId, pond }) {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const containerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

    // Lấy width và height ra TRƯỚC khi tính scale
    const { width, height } = canvasSize;

    // Bây giờ mới có thể dùng 'width'
    const baseWidth = 800;
    const scale = width / baseWidth;
    const iconScale = Math.max(scale, 0.5);
    const [backgroundImage] = useImage(
        'https://static.vecteezy.com/system/resources/thumbnails/007/670/107/large/aerial-view-of-amazing-water-surface-texture-beautiful-blue-ocaen-wave-nature-seascape-relaxation-and-summer-concept-free-video.jpg',

        'anonymous' // Thêm dòng này để xử lý lỗi bảo mật ảnh
    );
    // Thêm đoạn này vào đầu file hoặc bên ngoài component


    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                // Lấy kích thước thực tế của Card
                const { width: containerWidth } = containerRef.current.getBoundingClientRect();
                // Trừ đi padding (20px mỗi bên = 40px)
                const availableWidth = containerWidth - 40;

                if (availableWidth > 0) {
                    setCanvasSize({
                        width: availableWidth,
                        height: Math.round(availableWidth * 0.45)
                    });
                }
            }
        };

        // ResizeObserver giúp theo dõi sự thay đổi size của DIV thay vì WINDOW
        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        handleResize(); // Chạy lần đầu
        return () => observer.disconnect();
    }, []);

    const fetchDevices = async () => {
        try {
            const res = await api.get(`/api/devices?pondId=${pondId}`);
            setDevices(res.data);
        } catch { setDevices([]); }
    };

    const toggleDeviceStatus = async (device) => {
        const newStatus = device.status === 'ON' ? 'OFF' : 'ON';
        try {
            await api.put(`/api/devices/${device.id}`, { ...device, status: newStatus });
            toast.success(`Đã ${newStatus === 'ON' ? 'bật' : 'tắt'} ${device.name}`);
            fetchDevices();
        } catch { toast.error('Lỗi điều khiển'); }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 15000);
        return () => clearInterval(interval);
    }, [pondId]);

    const addDevice = async (type) => {
        try {
            const count = devices.filter(d => d.type === type).length + 1;
            await api.post('/api/devices', {
                pondId,
                name: type === 'FAN' ? `Quạt oxy ${count}` : `Cảm biến ${count}`,
                type, posX: 0.5, posY: 0.5, status: 'OFF'
            });
            fetchDevices();
            toast.success('Đã thêm');
        } catch { toast.error('Thất bại'); }
    };

    const deleteDevice = async (id) => {
        try {
            await api.delete(`/api/devices/${id}`);
            setSelectedDevice(null);
            fetchDevices();
            toast.success('Đã xóa');
        } catch { toast.error('Thất bại'); }
    };

    const handleDragEnd = async (device, e) => {
        const newX = Math.max(0.05, Math.min(0.95, e.target.x() / canvasSize.width));
        const newY = Math.max(0.05, Math.min(0.95, e.target.y() / canvasSize.height));
        try {
            await api.put(`/api/devices/${device.id}`, { ...device, posX: newX, posY: newY });
            fetchDevices();
        } catch { toast.error('Lỗi vị trí'); }
    };

    //quat quay
    const RotatingFan = ({ config, isOn, themeColor }) => {
        const fanRef = useRef();

        useEffect(() => {
            if (!isOn || !fanRef.current) return;

            // Tạo hiệu ứng xoay
            const anim = new Konva.Animation((frame) => {
                if (fanRef.current) {
                    // Tốc độ quay: 360 độ mỗi 2 giây
                    fanRef.current.rotation((frame.time * 0.18) % 360);
                }
            }, fanRef.current.getLayer());

            anim.start();
            return () => anim.stop();
        }, [isOn]);

        return (
            <Text
                ref={fanRef}
                text={config.char}
                fontSize={config.size}
                offsetX={config.ox}
                offsetY={config.oy}
                fill={isOn ? themeColor : '#94a3b8'}
                fontStyle={isOn ? 'bold' : 'normal'}
            />
        );
    };
    //boi ngau nhien
    const Shrimp = ({ width, height }) => {
        const shrimpRef = useRef();

        useEffect(() => {
            // Tọa độ ngẫu nhiên ban đầu
            let posX = Math.random() * width;
            let posY = Math.random() * height;
            let angle = Math.random() * Math.PI * 2; // Hướng di chuyển

            const anim = new Konva.Animation((frame) => {
                if (!shrimpRef.current) return;

                // Di chuyển
                posX += Math.cos(angle) * 0.5;
                posY += Math.sin(angle) * 0.5;

                // KIỂM TRA BIÊN CHẶT CHẼ
                if (posX < 0) {
                    posX = 0;
                    angle = Math.PI - angle;
                } else if (posX > width) {
                    posX = width;
                    angle = Math.PI - angle;
                }

                if (posY < 0) {
                    posY = 0;
                    angle = -angle;
                } else if (posY > height) {
                    posY = height;
                    angle = -angle;
                }

                shrimpRef.current.position({ x: posX, y: posY });
                // Thêm hiệu ứng xoay theo hướng bơi nhìn sẽ thật hơn
                // rotation tính bằng độ (degree)
                shrimpRef.current.rotation((angle * 180) / Math.PI + Math.sin(frame.time / 500) * 10);
            }, shrimpRef.current.getLayer());

            anim.start();
            return () => anim.stop();
        }, [width, height]);


        return <Text ref={shrimpRef} text="»" fontSize={12} fill="#94a3b8" opacity={0.3} />;
    };

    // ĐỊNH NGHĨA CẤU HÌNH RIÊNG CHO TỪNG LOẠI
    const iconConfig = {
        'FAN': {
            char: '⚙',
            size: 30,
            ox: 13, // Tâm x = size / 2
            oy: 14  // Nhích xuống một chút vì bánh răng thường hơi cao
        },
        'SENSOR': {
            char: '⦿', // Thử dùng icon lục giác này cho cảm biến, rất đều
            size: 32,
            ox: 15,
            oy: 18  // Hình này cân đối nên chia đôi là chuẩn
        },
        'DEFAULT': {
            char: '❓',
            size: 25,
            ox: 12.5,
            oy: 12.5
        }
    };

    return (
        <div style={styles.card} ref={containerRef}>
            <div style={styles.header}>
                <span style={styles.title}>🗺️ BẢN ĐỒ AO — THIẾT BỊ IOT</span>
                <div style={styles.toolbar}>
                    <button style={styles.toolBtn} onClick={() => addDevice('FAN')}>
                        {canvasSize.width < 500 ? '+ QUẠT' : '+ QUẠT OXY'}
                    </button>
                    <button style={styles.toolBtn} onClick={() => addDevice('SENSOR')}>
                        {canvasSize.width < 500 ? '+ SENSOR' : '+ CẢM BIẾN'}
                    </button>
                    {selectedDevice && (
                        <button style={{ ...styles.toolBtn, color: '#ff4d4d' }} onClick={() => deleteDevice(selectedDevice)}>
                            {canvasSize.width < 500 ? 'XÓA' : 'XÓA THIẾT BỊ'}
                        </button>
                    )}
                </div>
            </div>

            <div style={{
                position: 'relative',
                width: '100%',
                height: canvasSize.height, // Ép chiều cao div cha theo Stage
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                    <Stage width={canvasSize.width} height={canvasSize.height}>
                        <Layer>
                            {backgroundImage ? (
                                <Image
                                    image={backgroundImage}
                                    width={width}
                                    height={height}
                                    cornerRadius={12}
                                    opacity={0.2} // Chỉnh nhẹ để các icon nổi bật hơn
                                />
                            ) : (
                                <Rect x={0} y={0} width={width} height={height} fill="#0f172a" />
                            )}

                            {/* 2. Hiệu ứng lưới (Grid) - Giúp trông giống bản vẽ kỹ thuật nuôi tôm */}
                            {[...Array(Math.floor(width / 40))].map((_, i) => (
                                <Rect key={`v-${i}`} x={i * 40} y={0} width={1} height={height} fill="rgba(255,255,255,0.08)" />
                            ))}
                            {[...Array(Math.floor(height / 40))].map((_, i) => (
                                <Rect key={`h-${i}`} x={0} y={i * 40} width={width} height={1} fill="rgba(255,255,255,0.08)" />
                            ))}

                            {/* 3. Bờ ao (Border Line) - Tạo cảm giác ao có lót bạt */}
                            <Rect
                                x={5} y={5} width={width - 10} height={height - 10}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={2}
                                cornerRadius={10}
                                dash={[10, 5]} // Đường đứt đoạn nhìn rất "công nghệ"
                            />

                            {/* 4. Trang trí thêm một chút "Gợn sóng tĩnh" ở góc */}
                            <Circle x={width * 0.8} y={height * 0.2} radius={100} stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
                            <Circle x={width * 0.8} y={height * 0.2} radius={150} stroke="rgba(255,255,255,0.01)" strokeWidth={1} />

                            {[...Array(5)].map((_, i) => (
                                <Shrimp key={`shrimp-${i}`} width={width} height={height} />
                            ))}
                            {devices.map(device => {
                                const x = device.posX * width;
                                const y = device.posY * height;
                                const isOn = device.status === 'ON';
                                const isFan = device.type === 'FAN';
                                const themeColor = isFan ? '#38bdf8' : '#fbbf24';
                                const config = iconConfig[device.type] || iconConfig['DEFAULT'];

                                return (
                                    /* 1. ĐƯA DRAGGABLE RA NGOÀI CÙNG */
                                    <Group
                                        key={device.id}
                                        x={x}
                                        y={y}
                                        draggable
                                        onDragEnd={(e) => {
                                            // e.target lúc này là Group ngoài cùng, tọa độ tính theo Stage
                                            const newX = Math.max(0.05, Math.min(0.95, e.target.x() / width));
                                            const newY = Math.max(0.05, Math.min(0.95, e.target.y() / height));

                                            // Gọi hàm update vị trí
                                            handleDragEnd(device, {
                                                target: {
                                                    x: () => e.target.x(),
                                                    y: () => e.target.y()
                                                }
                                            });
                                        }}
                                    >
                                        {/* 2. Group này chỉ dùng để thu phóng (Scale) */}
                                        <Group scaleX={iconScale} scaleY={iconScale}>

                                            {/* 3. Ripple và Icon tọa độ 0,0 (vì đã theo Group cha) */}
                                            <DeviceRipple x={0} y={0} isEnabled={isOn} color={themeColor} />

                                            <Group
                                                onClick={() => {
                                                    setSelectedDevice(device.id);
                                                    toggleDeviceStatus(device);
                                                }}
                                                onMouseEnter={(e) => {
                                                    const stage = e.target.getStage();
                                                    const pos = stage.getPointerPosition();
                                                    const isSmallScreen = canvasSize.width < 500;

                                                    // Nếu thiết bị nằm quá 70% chiều rộng bản đồ, ta coi là "sát lề phải"
                                                    const isFarRight = pos.x > canvasSize.width * 0.7;

                                                    setTooltip({
                                                        x: pos.x,
                                                        y: pos.y - (isSmallScreen ? 60 : 55),
                                                        text: `${device.name} · ${isOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}`,
                                                        // Thêm thông tin hướng hiển thị
                                                        align: isFarRight ? 'right' : 'left'
                                                    });
                                                }}
                                                onMouseLeave={() => setTooltip(null)}
                                            >
                                                <Circle
                                                    radius={25}
                                                    fill={isOn ? "rgba(56, 189, 248, 0.15)" : "rgba(30, 41, 59, 0.9)"}
                                                    stroke={isOn ? themeColor : '#64748b'}
                                                    strokeWidth={selectedDevice === device.id ? 4 : 2}
                                                    shadowBlur={isOn ? 15 : 0}
                                                    shadowColor={themeColor}
                                                />

                                                {isFan ? (
                                                    <RotatingFan config={config} isOn={isOn} themeColor={themeColor} />
                                                ) : (
                                                    <Text
                                                        text={config.char}
                                                        fontSize={config.size}
                                                        offsetX={config.ox}
                                                        offsetY={config.oy}
                                                        fill={isOn ? themeColor : '#94a3b8'}
                                                    />
                                                )}

                                                <Circle
                                                    x={18} y={-18}
                                                    radius={7}
                                                    fill={isOn ? '#22c55e' : '#ef4444'}
                                                    stroke="#0f172a"
                                                    strokeWidth={2}
                                                />
                                            </Group>
                                        </Group>
                                    </Group>
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>
{tooltip && (
    <div style={{
        ...styles.tooltip,
        left: tooltip.x,
        top: tooltip.y,
        whiteSpace: 'nowrap', // Quan trọng: Giúp chữ luôn thẳng hàng, không bị xuống dòng
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        // Logic thay đổi vị trí dựa trên hướng
        transform: tooltip.align === 'right' 
            ? 'translateX(-100%)' // Đẩy toàn bộ sang trái nếu sát lề phải
            : 'translateX(-50%)', // Mặc định căn giữa
            
        // Thêm khoảng cách nhỏ để không dính sát vào con trỏ
        marginLeft: tooltip.align === 'right' ? '-10px' : '0px',
        
        // Đảm bảo chữ bên trong luôn căn giữa Tooltip
        textAlign: 'center', 
    }}>
        {tooltip.text}
    </div>
)}
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '16px',
        padding: isMobile ? '12px' : '20px', // Thu nhỏ padding trên mobile
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        width: '100%',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        // TRICK: Tự động xuống dòng khi màn hình quá chật
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '16px',
        gap: '10px'
    },
    title: {
        fontSize: isMobile ? '10px' : '16px', // Chữ nhỏ lại trên mobile
        fontWeight: '800',
        color: '#f8fafc',
        letterSpacing: '1.2px'
    },
    toolbar: {
        display: 'flex',
        gap: '8px',
        width: isMobile ? '100%' : 'auto' // Dàn hàng ngang hết cỡ trên mobile
    },
    toolBtn: {
        flex: isMobile ? 1 : 'none', // Các nút bằng nhau trên mobile
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.05)',
        color: '#f8fafc',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        textAlign: 'center'
    },

    tooltip: { position: 'absolute', background: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', pointerEvents: 'none', transform: 'translateX(-50%)', zIndex: 100, border: '1px solid #38bdf8' }
};