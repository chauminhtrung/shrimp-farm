import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PondMap({ pondId, pond }) {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [tooltip, setTooltip] = useState(null); // { x, y, text }
    const containerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

    useEffect(() => {
        if (containerRef.current) {
            const w = containerRef.current.offsetWidth - 32;
            setCanvasSize({ width: w, height: Math.round(w * 0.45) });
        }
    }, []);

    const fetchDevices = async () => {
        try {
            const res = await api.get(`/api/devices?pondId=${pondId}`);
            setDevices(res.data);
        } catch {
            setDevices([]);
        }
    };

    useEffect(() => { fetchDevices(); }, [pondId]);

    const addDevice = async (type) => {
        try {
            await api.post('/api/devices', {
                pondId,
                name: type === 'FAN'
                    ? `Fan ${devices.filter(d => d.type === 'FAN').length + 1}`
                    : `Sensor ${devices.filter(d => d.type === 'SENSOR').length + 1}`,
                type,
                posX: 0.5,
                posY: 0.5,
                status: 'OFF'
            });
            toast.success('Đã thêm thiết bị');
            fetchDevices();
        } catch {
            toast.error('Thêm thiết bị thất bại');
        }
    };

    const deleteDevice = async (id) => {
        try {
            await api.delete(`/api/devices/${id}`);
            toast.success('Đã xóa thiết bị');
            setSelectedDevice(null);
            fetchDevices();
        } catch {
            toast.error('Xóa thất bại');
        }
    };

    const handleDragEnd = async (device, e) => {
        const newX = e.target.x() / canvasSize.width;
        const newY = e.target.y() / canvasSize.height;
        const clampedX = Math.max(0.02, Math.min(0.95, newX));
        const clampedY = Math.max(0.02, Math.min(0.95, newY));

        try {
            await api.put(`/api/devices/${device.id}`, {
                pondId,
                name: device.name,
                type: device.type,
                posX: clampedX,
                posY: clampedY,
                status: device.status
            });
            fetchDevices();
        } catch {
            toast.error('Cập nhật vị trí thất bại');
        }
    };

    const { width, height } = canvasSize;

    return (
        <div style={styles.card} ref={containerRef}>
            <div style={styles.header}>
                <span style={styles.title}>🗺️ Bản đồ ao — thiết bị IoT</span>
                <div style={styles.toolbar}>
                    <button style={styles.toolBtn} onClick={() => addDevice('FAN')}>
                        + Quạt oxy
                    </button>
                    <button style={styles.toolBtn} onClick={() => addDevice('SENSOR')}>
                        + Sensor
                    </button>
                    {selectedDevice && (
                        <button
                            style={{...styles.toolBtn,
                                color: '#E24B4A', borderColor: '#E24B4A'}}
                            onClick={() => deleteDevice(selectedDevice)}
                        >
                            Xóa thiết bị
                        </button>
                    )}
                </div>
            </div>

            {/* Canvas wrapper — để tooltip định vị được */}
            <div style={{ position: 'relative' }}>
                <Stage width={width} height={height}>
                    <Layer>
                        {/* Nền ao */}
                        <Rect
                            x={0} y={0}
                            width={width} height={height}
                            fill="#C8E6F5"
                            cornerRadius={8}
                        />
                        <Rect
                            x={2} y={2}
                            width={width - 4} height={height - 4}
                            fill="transparent"
                            stroke="#85B7EB"
                            strokeWidth={2}
                            cornerRadius={6}
                        />

                        {/* Thiết bị */}
                        {devices.map(device => {
                            const x = device.posX * width;
                            const y = device.posY * height;
                            const isFan = device.type === 'FAN';
                            const isSelected = selectedDevice === device.id;

                            return (
                                <Group
                                    key={device.id}
                                    x={x} y={y}
                                    draggable
                                    onDragEnd={(e) => handleDragEnd(device, e)}
                                    onClick={() => setSelectedDevice(
                                        isSelected ? null : device.id
                                    )}
                                    onMouseEnter={(e) => {
                                        const stage = e.target.getStage();
                                        const pos = stage.getPointerPosition();
                                        setTooltip({
                                            x: pos.x,
                                            y: pos.y - 36,
                                            text: `${device.name} · ${device.status}`
                                        });
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    {isSelected && (
                                        <Circle
                                            radius={22}
                                            fill="rgba(24,95,165,0.15)"
                                        />
                                    )}
                                    <Circle
                                        radius={16}
                                        fill={isFan ? '#E1F5EE' : '#FAEEDA'}
                                        stroke={isSelected ? '#185FA5' :
                                            (isFan ? '#1D9E75' : '#BA7517')}
                                        strokeWidth={isSelected ? 2.5 : 1.5}
                                    />
                                    <Text
                                        text={isFan ? '⚙' : '📡'}
                                        fontSize={14}
                                        offsetX={7}
                                        offsetY={7}
                                    />
                                    {/* Status dot */}
                                    <Circle
                                        x={12} y={-12}
                                        radius={4}
                                        fill={device.status === 'ON'
                                            ? '#1D9E75'
                                            : device.status === 'ERROR'
                                            ? '#E24B4A' : '#ccc'}
                                    />
                                </Group>
                            );
                        })}

                        {/* Hint */}
                        <Text
                            text="Keo de di chuyen · Click de chon"
                            fontSize={10}
                            fill="rgba(24,95,165,0.5)"
                            x={8} y={height - 18}
                        />
                    </Layer>
                </Stage>

                {/* HTML Tooltip — hỗ trợ tiếng Việt */}
                {tooltip && (
                    <div style={{
                        ...styles.tooltip,
                        left: tooltip.x,
                        top: tooltip.y
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
        background: '#fff', borderRadius: '12px',
        padding: '16px', border: '1px solid #e8e8e8'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px',
        flexWrap: 'wrap', gap: '8px'
    },
    title: { fontSize: '13px', fontWeight: '600', color: '#1a1a1a' },
    toolbar: { display: 'flex', gap: '6px' },
    toolBtn: {
        padding: '4px 10px', background: '#fff',
        color: '#185FA5', border: '1px solid #B5D4F4',
        borderRadius: '6px', fontSize: '11px', cursor: 'pointer'
    },
tooltip: {
    position: 'absolute',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transform: 'translateX(-50%)',
    zIndex: 10
}
};