import React from 'react';

const DashboardHeader = ({ userName, totalPonds, alertPonds }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng";
        if (hour < 18) return "Chào buổi chiều";
        return "Chào buổi tối";
    };

    return (
        <div style={styles.headerContainer}>
            <div style={styles.welcomeText}>
                <h1 style={styles.greeting}>{getGreeting()}, {userName}! 👋</h1>
                <p style={styles.subText}>
                    Hệ thống đang giám sát <strong>{totalPonds}</strong> ao nuôi. 
                    {alertPonds > 0 ? (
                        <span style={{ color: '#ef4444' }}> Cần kiểm tra ngay {alertPonds} ao!</span>
                    ) : (
                        <span style={{ color: '#22c55e' }}> Tất cả các chỉ số đều an toàn.</span>
                    )}
                </p>
            </div>
            <div style={styles.searchBox}>
                <input type="text" placeholder="Tìm nhanh tên ao..." style={styles.searchInput}/>
            </div>
        </div>
    );
};

// QUAN TRỌNG: Phải có dòng này để file khác gọi được
export default DashboardHeader;

const styles = {
    headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
    greeting: { fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px 0' },
    subText: { fontSize: '16px', color: '#94a3b8', margin: 0 },
    searchBox: { width: '300px' },
    searchInput: {
        width: '100%', padding: '12px 20px', background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: '#fff', outline: 'none'
    }
};