import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatePondModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        name: '', location: '', area: '', width: '800', height: '500'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            ...form,
            area: parseFloat(form.area),
            width: parseFloat(form.width),
            height: parseFloat(form.height)
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                style={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    style={styles.modal}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={styles.header}>
                        <h3 style={styles.title}>🌊 Tạo ao nuôi mới</h3>
                        <button style={styles.closeBtn} onClick={onClose}>✕</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {[
                            { key: 'name', label: 'Tên ao nuôi', placeholder: 'Ví dụ: Ao tôm thẻ chân trắng' },
                            { key: 'location', label: 'Vị trí khu vực', placeholder: 'Ví dụ: Khu A - Lô 2' },
                            { key: 'area', label: 'Diện tích (m²)', placeholder: '500' },
                        ].map((f, index) => (
                            <motion.div
                                key={f.key}
                                style={styles.field}
                                // Hiệu ứng các dòng input xuất hiện lần lượt (stagger)
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <label style={styles.label}>{f.label}</label>
                                <motion.input
                                    style={styles.input}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    required={f.key !== 'location'}
                                    // Hiệu ứng khi nhấn vào ô input (focus)
                                    whileFocus={{
                                        scale: 1.02,
                                        borderColor: '#38bdf8',
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
                                    }}
                                />
                            </motion.div>
                        ))}

                        <div style={styles.actions}>
                            {/* Nút Hủy bỏ: Hiệu ứng nhẹ nhàng, co lại khi bấm */}
                            <motion.button
                                type="button"
                                style={styles.cancelBtn}
                                onClick={onClose}
                                whileHover={{
                                    background: 'rgba(245, 164, 164, 0.1)',
                                    color: '#f57f7f'
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Hủy bỏ
                            </motion.button>

                            {/* Nút Khởi tạo: Hiệu ứng phát sáng mạnh mẽ (Glow) */}
                            <motion.button
                                type="submit"
                                style={styles.submitBtn}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
                                    filter: 'brightness(1.1)'
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Khởi tạo ngay
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0, 8, 20, 0.7)', // Màu tối sâu hơn để làm nổi lớp kính
        backdropFilter: 'blur(8px)', // Làm mờ hậu cảnh
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: 'rgba(255, 255, 255, 0.05)', // Nền trắng trong suốt cực thấp
        backdropFilter: 'blur(16px)', // Hiệu ứng kính mờ đặc trưng
        borderRadius: '24px',
        padding: '30px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid rgba(255, 255, 255, 0.1)', // Viền kính nhẹ
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '25px'
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#f8fafc', // Màu chữ sáng cho Dark mode
        margin: 0
    },
    closeBtn: {
        background: 'rgba(255,255,255,0.1)', border: 'none',
        width: '32px', height: '32px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', cursor: 'pointer', color: '#cbd5e1',
        transition: 'all 0.3s'
    },
    field: { marginBottom: '18px' },
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '600', color: '#94a3b8', marginBottom: '8px',
        marginLeft: '4px'
    },
    input: {
        width: '100%', padding: '12px 16px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        fontSize: '15px', outline: 'none', boxSizing: 'border-box',
        transition: 'all 0.3s focus',
    },
    actions: {
        display: 'flex', gap: '12px', marginTop: '30px'
    },
    cancelBtn: {
        flex: 1, padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#94a3b8',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.3s'
    },
    submitBtn: {
        flex: 1, padding: '12px',
        background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)', // Gradient xanh hiện đại
        color: '#fff',
        border: 'none', borderRadius: '12px',
        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
        transition: 'all 0.3s'
    }
};