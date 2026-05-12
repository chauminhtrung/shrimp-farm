import React from 'react';
import { motion } from 'framer-motion';

// 1. Thêm onAddClick vào props để nhận function từ PondListPage
const DashboardHeader = ({ userName, totalPonds, alertPonds, onAddClick, searchQuery, onSearchChange }) => {

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng";
        if (hour < 18) return "Chào buổi chiều";
        return "Chào buổi tối";
    };

    return (
        <div style={styles.headerContainer}>
            {/* Cụm bên trái: Lời chào */}
            <div style={styles.welcomeText}>
                <h1 style={styles.greeting}>{getGreeting()}, {userName}! 👋</h1>
                <p style={styles.subText}>
                    Hệ thống đang giám sát <strong>{totalPonds}</strong> ao nuôi.
                    {alertPonds > 0 ? (
                        <span style={{ color: '#ef4444', fontWeight: '600' }}> Cần kiểm tra ngay {alertPonds} ao!</span>
                    ) : (
                        <span style={{ color: '#22c55e', fontWeight: '600' }}> Tất cả đều an toàn.</span>
                    )}
                </p>
            </div>

            {/* Cụm bên phải: Nút bấm và Ô tìm kiếm */}
            <div style={styles.actions}>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
                        filter: 'brightness(1.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.createBtn}
                    onClick={onAddClick}
                >
                    <span style={{ fontSize: '18px' }}>+</span> Thêm ao nuôi
                </motion.button>

                <div style={styles.searchBox}>
                    {/* INPUT VỚI MOTION VÀ LOGIC TÌM KIẾM */}
                    <motion.input
                        type="text"
                        placeholder="Tìm nhanh tên ao..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        // Hiệu ứng Motion khi tập trung vào ô search
                        whileFocus={{
                            scale: 1.05,
                            width: '300px', // Hơi rộng ra một chút khi gõ
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderColor: '#38bdf8',
                            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;

const styles = {
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // Đổi thành center để cân đối hơn với nút bấm
        marginBottom: '40px',
        gap: '20px',
        flexWrap: 'wrap' // Hỗ trợ mobile nếu màn hình hẹp
    },
    welcomeText: { flex: 1, minWidth: '300px' },
    greeting: { fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px 0' },
    subText: { fontSize: '15px', color: '#94a3b8', margin: 0 },

    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px' // Khoảng cách giữa nút và ô search
    },

    createBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 20px rgba(29, 78, 216, 0.2)',
        whiteSpace: 'nowrap'
    },

    searchBox: { width: '260px' },
    searchInput: {
        width: '100%',
        padding: '12px 18px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        color: '#fff',
        outline: 'none',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        // Hiệu ứng khi focus vào ô tìm kiếm
        ':focus': {
            background: 'rgba(255, 255, 255, 0.07)',
            borderColor: '#38bdf8'
        }
    }
};