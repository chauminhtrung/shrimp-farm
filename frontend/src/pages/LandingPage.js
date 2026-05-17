import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // Theo dõi trạng thái cuộn chuột
    const [hoveredNav, setHoveredNav] = useState(null); // Quản lý hiệu ứng hover link

    // Theo dõi hành vi cuộn trang để thay đổi style Navbar độc lập
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDashboardNavigation = (targetPath = '/ponds') => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(targetPath);
        }, 800);
    };

    const features = [
        { icon: '🌡️', title: 'Giám sát Realtime', desc: 'Theo dõi pH, nhiệt độ, oxy hòa tan và độ đục cập nhật mỗi 30 giây từ cảm biến IoT.' },
        { icon: '🗺️', title: 'Bản đồ ao trực quan', desc: 'Thiết kế bố cục ao nuôi, kéo thả thiết bị IoT trên bản đồ trực quan.' },
        { icon: '🤖', title: 'AI dự đoán', desc: 'Trí tuệ nhân tạo phân tích môi trường nước, dự đoán nguy cơ dịch bệnh trước 6–24 giờ.' },
        { icon: '🔔', title: 'Cảnh báo tự động', desc: 'Nhận cảnh báo ngay khi thông số môi trường vượt ngưỡng an toàn.' },
        { icon: '👥', title: 'Cộng đồng', desc: 'Kết nối với hàng nghìn người nuôi tôm, chia sẻ kinh nghiệm và giải pháp.' },
        { icon: '📊', title: 'Phân tích dữ liệu', desc: 'Biểu đồ lịch sử giúp nhận biết xu hướng và đưa ra quyết định kịp thời.' },
    ];

    const stats = [
        { value: '15s', label: 'Cập nhật dữ liệu' },
        { value: '24/7', label: 'Giám sát liên tục' },
        { value: 'AI', label: 'Dự đoán thông minh' },
        { value: '100%', label: 'Miễn phí' },
    ];

    const thresholds = [
        { param: 'Nhiệt độ', safe: '25 – 32°C', icon: '🌡️' },
        { param: 'pH', safe: '6.5 – 8.5', icon: '⚗️' },
        { param: 'Oxy hòa tan', safe: '> 4.0 mg/L', icon: '💧' },
        { param: 'Độ đục', safe: '0 – 5 NTU', icon: '🌊' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={styles.page}
        >
            {/* LỚP PHỦ ĐIỆN ẢNH (CINEMATIC OVERLAY) */}
            <div style={{
                ...styles.cinematicOverlay,
                opacity: isTransitioning ? 1 : 0,
                pointerEvents: isTransitioning ? 'all' : 'none',
            }} />

            {/* NAVBAR CAO CẤP PHÁT TRIỂN MỚI */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                    ...styles.nav,
                    background: isScrolled ? 'rgba(11, 24, 44, 0.85)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(16px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.0)',
                    boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.2)' : 'none',
                }}
            >
                <div style={styles.navInner}>
                    <motion.div
                        style={styles.logo}
                        onClick={() => navigate('/ponds')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span style={styles.logoEmoji}>🦐</span>
                        <span style={styles.logoText}>AquaMonitor</span>
                    </motion.div>

                    {/* Menu links với hiệu ứng kính râm mờ khi hover */}
                    <div style={styles.navLinks}>
                        {[
                            { name: 'Tính năng', href: '#features' },
                            { name: 'Cách hoạt động', href: '#how' },
                            { name: 'Ngưỡng chuẩn', href: '#threshold' }
                        ].map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                style={{
                                    ...styles.navLink,
                                    color: isScrolled ? '#E2E8F0' : 'rgba(255,255,255,0.9)'
                                }}
                                onMouseEnter={() => setHoveredNav(idx)}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <span style={{ zIndex: 2, position: 'relative' }}>{link.name}</span>
                                {hoveredNav === idx && (
                                    <motion.div
                                        layoutId="navHoverBg"
                                        style={styles.navHoverBg}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Khu vực nút bấm thông minh */}
                    <div style={styles.navActions}>
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                style={styles.btnPrimary}
                                onClick={() => handleDashboardNavigation('/ponds')}
                            >
                                Vào Dashboard →
                            </motion.button>
                        ) : (
                            <>
                                <button
                                    style={{
                                        ...styles.btnGhost,
                                        color: isScrolled ? '#7DE8C0' : '#fff',
                                        borderColor: isScrolled ? '#7DE8C0' : 'rgba(255,255,255,0.4)'
                                    }}
                                    onClick={() => handleDashboardNavigation('/login')}
                                >
                                    Đăng nhập
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(125, 232, 192, 0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.btnPrimary}
                                    onClick={() => handleDashboardNavigation('/register')}
                                >
                                    Đăng ký miễn phí
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>

                    <div style={styles.heroBadge}>
                        Công nghệ IoT + AI cho nuôi trồng thủy sản
                    </div>
                    <h1 style={styles.heroTitle}>
                        Giám sát ao nuôi tôm<br />
                        <span style={styles.heroHighlight}>thông minh & tự động</span>
                    </h1>
                    <p style={styles.heroDesc}>
                        Hệ thống theo dõi môi trường nước theo thời gian thực,
                        cảnh báo sớm và dự đoán nguy cơ dịch bệnh bằng trí tuệ nhân tạo.
                        Giúp người nuôi tôm giảm thiểu rủi ro và tối ưu năng suất.
                    </p>
                    <div style={styles.heroButtons}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            style={styles.btnHeroPrimary}
                            onClick={() => handleDashboardNavigation('/register')}
                        >
                            Bắt đầu miễn phí →
                        </motion.button>
                        <button
                            style={styles.btnHeroGhost}
                            onClick={() => handleDashboardNavigation('/login')}
                        >
                            Đăng nhập
                        </button>
                    </div>

                    {/* Stats strip */}
                    <div style={styles.statsRow}>
                        {stats.map((s, i) => (
                            <div key={i} style={styles.statItem}>
                                <div style={styles.statValue}>{s.value}</div>
                                <div style={styles.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={styles.section}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionTag}>Tính năng</div>
                    <h2 style={styles.sectionTitle}>
                        Tất cả những gì bạn cần để quản lý ao nuôi tôm
                    </h2>
                    <p style={styles.sectionDesc}>
                        Từ giám sát realtime đến dự đoán AI — AquaMonitor
                        cung cấp đầy đủ công cụ cho người nuôi tôm hiện đại.
                    </p>
                    <div style={styles.featGrid}>
                        {features.map((f, i) => (
                            <div key={i} style={styles.featCard}>
                                <div style={styles.featIcon}>{f.icon}</div>
                                <div style={styles.featTitle}>{f.title}</div>
                                <div style={styles.featDesc}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how" style={{ ...styles.section, background: '#F0F4F8' }}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionTag}>Cách hoạt động</div>
                    <h2 style={styles.sectionTitle}>
                        Chỉ 3 bước để bắt đầu giám sát
                    </h2>
                    <div style={styles.stepsRow}>
                        {[
                            { step: '01', title: 'Tạo tài khoản', desc: 'Đăng ký miễn phí và tạo ao nuôi của bạn trên hệ thống.', icon: '👤' },
                            { step: '02', title: 'Kết nối thiết bị', desc: 'Lắp cảm biến IoT vào ao, thiết bị tự động gửi dữ liệu lên hệ thống.', icon: '📡' },
                            { step: '03', title: 'Theo dõi & nhận cảnh báo', desc: 'Xem dashboard realtime, nhận cảnh báo và dự đoán AI tức thì.', icon: '📊' },
                        ].map((s, i) => (
                            <div key={i} style={styles.stepCard}>
                                <div style={styles.stepNum}>{s.step}</div>
                                <div style={styles.stepIcon}>{s.icon}</div>
                                <div style={styles.stepTitle}>{s.title}</div>
                                <div style={styles.stepDesc}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THRESHOLD */}
            <section id="threshold" style={styles.section}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionTag}>Ngưỡng chuẩn</div>
                    <h2 style={styles.sectionTitle}>
                        Thông số môi trường an toàn cho tôm
                    </h2>
                    <p style={styles.sectionDesc}>
                        Hệ thống tự động cảnh báo khi thông số vượt ngoài ngưỡng an toàn.
                    </p>
                    <div style={styles.thresholdGrid}>
                        {thresholds.map((t, i) => (
                            <div key={i} style={styles.thresholdCard}>
                                <div style={styles.thresholdIcon}>{t.icon}</div>
                                <div style={styles.thresholdParam}>{t.param}</div>
                                <div style={styles.thresholdSafe}>{t.safe}</div>
                                <div style={styles.thresholdLabel}>Ngưỡng an toàn</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={styles.cta}>
                <div style={styles.ctaInner}>
                    <h2 style={styles.ctaTitle}>
                        Bắt đầu giám sát ao nuôi của bạn ngay hôm nay
                    </h2>
                    <p style={styles.ctaDesc}>
                        Miễn phí hoàn toàn. Không cần thẻ tín dụng.
                    </p>
                    <button
                        style={styles.ctaBtn}
                        onClick={() => handleDashboardNavigation('/register')}
                    >
                        Đăng ký miễn phí →
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <div style={styles.footerLogo}>
                        <span style={styles.logoEmoji}>🦐</span>
                        <span style={styles.logoText}>AquaMonitor</span>
                    </div>
                    <div style={styles.footerDesc}>
                        Hệ thống giám sát ao nuôi tôm thông minh
                    </div>
                    <div style={styles.footerLinks}>
                        <span style={styles.footerLink} onClick={() => handleDashboardNavigation('/login')}>
                            Đăng nhập
                        </span>
                        <span style={styles.footerDot}>·</span>
                        <span style={styles.footerLink} onClick={() => handleDashboardNavigation('/register')}>
                            Đăng ký
                        </span>
                        <span style={styles.footerDot}>·</span>
                        <span style={styles.footerLink} onClick={() => handleDashboardNavigation('/ponds')}>
                            Dashboard
                        </span>
                    </div>
                    <div style={styles.footerCopy}>
                        © 2026 AquaMonitor — Đồ án tốt nghiệp
                    </div>
                </div>
            </footer>
        </motion.div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#fff', fontFamily: 'Arial, sans-serif', scrollBehavior: 'smooth' },

    // TỐI ƯU NAVBAR KÍNH MỜ ĐIỆN ẢNH
    nav: {
        position: 'fixed', // Chuyển từ sticky sang fixed để lướt mượt trên nền Hero gradient
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    navInner: {
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
    logoEmoji: { fontSize: '24px' },
    logoText: {
        fontSize: '20px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        // Đổ màu gradient cho text giống với các nút bấm chính (Sky Blue)
        background: 'linear-gradient(135deg, #38bdf8 0%, #fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    navLinks: { display: 'flex', gap: '8px', alignItems: 'center' },
    navLink: {
        position: 'relative',
        fontSize: '14px', fontWeight: '500',
        textDecoration: 'none',
        padding: '8px 16px', borderRadius: '8px',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },
    navHoverBg: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        zIndex: 1
    },
    navActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    btnGhost: {
        padding: '8px 18px', background: 'transparent',
        border: '1px solid',
        borderRadius: '8px', fontSize: '14px',
        fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    btnPrimary: {
        padding: '9px 20px', background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff', border: 'none',
        borderRadius: '8px', fontSize: '14px',
        fontWeight: '700', cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(125, 232, 192, 0.2)',
    },

    // Hero (Tăng padding-top để tránh bị đè do Navbar đổi sang vị trí fixed)
    hero: {
        background: 'linear-gradient(135deg, #0B182C 0%, #12355B 50%, #15524B 100%)',
        padding: '140px 20px 80px', color: '#fff'
    },
    heroInner: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
    heroBadge: {
        display: 'inline-block',
        background: 'rgba(255,255,255,0.08)',
        padding: '6px 16px', borderRadius: '20px',
        fontSize: '13px', marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.15)',
        fontSize: '17px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        // Đổ màu gradient cho text giống với các nút bấm chính (Sky Blue)
        background: 'linear-gradient(135deg, #38bdf8 0%, #fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroTitle: {
        fontSize: '46px', fontWeight: '800',
        lineHeight: 1.25, marginBottom: '20px',
        letterSpacing: '-0.5px'
    },
    heroHighlight: {
        fontSize: '44px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        // Đổ màu gradient cho text giống với các nút bấm chính (Sky Blue)
        background: 'linear-gradient(135deg, #38bdf8 0%, #fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroDesc: {
        fontSize: '16px', lineHeight: 1.7,
        opacity: 0.85, maxWidth: '640px',
        margin: '0 auto 36px'
    },
    heroButtons: { display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '50px' },
    btnHeroPrimary: {
        padding: '14px 32px', background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff', border: 'none',
        borderRadius: '10px', fontSize: '15px',
        fontWeight: '700', cursor: 'pointer',
        boxShadow: '0 5px 20px rgba(125, 232, 192, 0.3)'
    },
    btnHeroGhost: {
        padding: '14px 32px',
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '10px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer',
        transition: 'background 0.3s'
    },
    statsRow: {
        display: 'flex', justifyContent: 'center',
        gap: '50px', borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '32px'
    },
    statItem: { textAlign: 'center' },
    statValue: {
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        // Đổ màu gradient cho text giống với các nút bấm chính (Sky Blue)
        background: 'linear-gradient(135deg, #38bdf8 0%, #fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    statLabel: { fontSize: '13px', opacity: 0.7, marginTop: '4px' },

    // Sections
    section: { padding: '80px 20px' },
    sectionInner: { maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
    sectionTag: {
        display: 'inline-block',
        background: '#E6F1FB', color: '#185FA5',
        padding: '4px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600',
        marginBottom: '14px'
    },
    sectionTitle: {
        fontSize: '32px', fontWeight: '700',
        color: '#1a1a1a', marginBottom: '14px'
    },
    sectionDesc: {
        fontSize: '16px', color: '#666',
        maxWidth: '580px', margin: '0 auto 48px',
        lineHeight: 1.7
    },

    // Features
    featGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px', textAlign: 'left'
    },
    featCard: {
        background: '#fff', border: '1px solid #e8e8e8',
        borderRadius: '12px', padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    },
    featIcon: { fontSize: '32px', marginBottom: '14px' },
    featTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    featDesc: { fontSize: '13px', color: '#666', lineHeight: 1.7 },

    // Steps
    stepsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
    },
    stepCard: {
        background: '#fff', borderRadius: '12px',
        padding: '32px 24px', textAlign: 'center',
        border: '1px solid #e0e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
    },
    stepNum: {
        fontSize: '13px', fontWeight: '700',
        color: '#185FA5', marginBottom: '14px',
        background: '#E6F1FB', display: 'inline-block',
        padding: '4px 12px', borderRadius: '20px'
    },
    stepIcon: { fontSize: '36px', marginBottom: '14px' },
    stepTitle: { fontSize: '17px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    stepDesc: { fontSize: '14px', color: '#666', lineHeight: 1.7 },

    // Threshold
    thresholdGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
    },
    thresholdCard: {
        background: '#F8FBFF', border: '1px solid #D0E4F5',
        borderRadius: '12px', padding: '28px 18px',
        textAlign: 'center'
    },
    thresholdIcon: { fontSize: '32px', marginBottom: '12px' },
    thresholdParam: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    thresholdSafe: { fontSize: '22px', fontWeight: '700', color: '#185FA5', marginBottom: '4px' },
    thresholdLabel: { fontSize: '12px', color: '#888' },

    // CTA
    cta: {
        background: 'linear-gradient(135deg, #0B182C, #12355B)',
        padding: '80px 20px', textAlign: 'center', color: '#fff'
    },
    ctaInner: { maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { fontSize: '32px', fontWeight: '700', marginBottom: '14px' },
    ctaDesc: { fontSize: '16px', opacity: 0.85, marginBottom: '32px' },
    ctaBtn: {
        padding: '14px 36px', background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
        color: '#fff', border: 'none',
        borderRadius: '10px', fontSize: '15px',
        fontWeight: '700', cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(125, 232, 192, 0.3)'
    },

    cinematicOverlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: '#0B0F19',
        zIndex: 9999,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
    },

    // Footer
    footer: { background: '#07101E', padding: '40px 20px', textAlign: 'center', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)' },
    footerInner: { maxWidth: '600px', margin: '0 auto' },
    footerLogo: {
        fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontSize: '20px',
        fontWeight: '800',

    },
    footerDesc: { fontSize: '14px', opacity: 0.6, marginBottom: '20px' },
    footerLinks: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' },
    footerLink: { fontSize: '14px', color: '#E2E8F0', cursor: 'pointer', transition: 'color 0.2s' },
    footerDot: { fontSize: '14px', opacity: 0.4 },
    footerCopy: { fontSize: '12px', opacity: 0.4 }
}; 