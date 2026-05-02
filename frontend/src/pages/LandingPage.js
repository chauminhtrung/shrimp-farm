import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const features = [
        {
            icon: '🌡️',
            title: 'Giám sát Realtime',
            desc: 'Theo dõi pH, nhiệt độ, oxy hòa tan và độ đục cập nhật mỗi 30 giây từ cảm biến IoT.'
        },
        {
            icon: '🗺️',
            title: 'Bản đồ ao trực quan',
            desc: 'Thiết kế bố cục ao nuôi, kéo thả thiết bị IoT trên bản đồ trực quan.'
        },
        {
            icon: '🤖',
            title: 'AI dự đoán',
            desc: 'Trí tuệ nhân tạo phân tích môi trường nước, dự đoán nguy cơ dịch bệnh trước 6–24 giờ.'
        },
        {
            icon: '🔔',
            title: 'Cảnh báo tự động',
            desc: 'Nhận cảnh báo ngay khi thông số môi trường vượt ngưỡng an toàn.'
        },
        {
            icon: '👥',
            title: 'Cộng đồng',
            desc: 'Kết nối với hàng nghìn người nuôi tôm, chia sẻ kinh nghiệm và giải pháp.'
        },
        {
            icon: '📊',
            title: 'Phân tích dữ liệu',
            desc: 'Biểu đồ lịch sử giúp nhận biết xu hướng và đưa ra quyết định kịp thời.'
        },
    ];

    const stats = [
        { value: '15s', label: 'Cập nhật dữ liệu' },
        { value: '24/7', label: 'Giám sát liên tục' },
        { value: 'AI', label: 'Dự đoán thông minh' },
        { value: '100%', label: 'Miễn phí' },
    ];

    const thresholds = [
        { param: 'Nhiệt độ', safe: '25 – 32°C', icon: '🌡️' },
        { param: 'pH',       safe: '6.5 – 8.5', icon: '⚗️' },
        { param: 'Oxy hòa tan', safe: '> 4.0 mg/L', icon: '💧' },
        { param: 'Độ đục',   safe: '0 – 5 NTU', icon: '🌊' },
    ];

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav style={styles.nav}>
                <div style={styles.navInner}>
                    <div style={styles.logo}>🦐 AquaMonitor</div>
                    <div style={styles.navLinks}>
                        <a href="#features" style={styles.navLink}>Tính năng</a>
                        <a href="#how" style={styles.navLink}>Cách hoạt động</a>
                        <a href="#threshold" style={styles.navLink}>Ngưỡng chuẩn</a>
                    </div>
                    <div style={styles.navActions}>
                        {user ? (
                            <button
                                style={styles.btnPrimary}
                                onClick={() => navigate('/ponds')}
                            >
                                Vào Dashboard →
                            </button>
                        ) : (
                            <>
                                <button
                                    style={styles.btnGhost}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    style={styles.btnPrimary}
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký miễn phí
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    <div style={styles.heroBadge}>
                        🚀 Công nghệ IoT + AI cho nuôi trồng thủy sản
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
                        <button
                            style={styles.btnHeroPrimary}
                            onClick={() => navigate('/register')}
                        >
                            Bắt đầu miễn phí →
                        </button>
                        <button
                            style={styles.btnHeroGhost}
                            onClick={() => navigate('/login')}
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
                            {
                                step: '01',
                                title: 'Tạo tài khoản',
                                desc: 'Đăng ký miễn phí và tạo ao nuôi của bạn trên hệ thống.',
                                icon: '👤'
                            },
                            {
                                step: '02',
                                title: 'Kết nối thiết bị',
                                desc: 'Lắp cảm biến IoT vào ao, thiết bị tự động gửi dữ liệu lên hệ thống.',
                                icon: '📡'
                            },
                            {
                                step: '03',
                                title: 'Theo dõi & nhận cảnh báo',
                                desc: 'Xem dashboard realtime, nhận cảnh báo và dự đoán AI tức thì.',
                                icon: '📊'
                            },
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
                        onClick={() => navigate('/register')}
                    >
                        Đăng ký miễn phí →
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <div style={styles.footerLogo}>🦐 AquaMonitor</div>
                    <div style={styles.footerDesc}>
                        Hệ thống giám sát ao nuôi tôm thông minh
                    </div>
                    <div style={styles.footerLinks}>
                        <span
                            style={styles.footerLink}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </span>
                        <span style={styles.footerDot}>·</span>
                        <span
                            style={styles.footerLink}
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </span>
                        <span style={styles.footerDot}>·</span>
                        <span
                            style={styles.footerLink}
                            onClick={() => navigate('/ponds')}
                        >
                            Dashboard
                        </span>
                    </div>
                    <div style={styles.footerCopy}>
                        © 2026 AquaMonitor — Đồ án tốt nghiệp
                    </div>
                </div>
            </footer>

        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#fff', fontFamily: 'Arial, sans-serif' },

    // Navbar
    nav: {
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e8e8e8',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
    },
    navInner: {
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 20px', height: '60px',
        display: 'flex', alignItems: 'center', gap: '24px'
    },
    logo: { fontSize: '18px', fontWeight: '700', color: '#185FA5', flex: 0 },
    navLinks: { display: 'flex', gap: '4px', flex: 1 },
    navLink: {
        fontSize: '13px', color: '#555', textDecoration: 'none',
        padding: '6px 12px', borderRadius: '6px',
        cursor: 'pointer'
    },
    navActions: { display: 'flex', gap: '8px', alignItems: 'center' },
    btnGhost: {
        padding: '7px 16px', background: 'transparent',
        color: '#185FA5', border: '1px solid #185FA5',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },
    btnPrimary: {
        padding: '7px 16px', background: '#185FA5',
        color: '#fff', border: 'none',
        borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'pointer'
    },

    // Hero
    hero: {
        background: 'linear-gradient(135deg, #0D3B6E 0%, #185FA5 50%, #1D9E75 100%)',
        padding: '80px 20px 60px', color: '#fff'
    },
    heroInner: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
    heroBadge: {
        display: 'inline-block',
        background: 'rgba(255,255,255,0.15)',
        padding: '6px 16px', borderRadius: '20px',
        fontSize: '13px', marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.2)'
    },
    heroTitle: {
        fontSize: '42px', fontWeight: '700',
        lineHeight: 1.2, marginBottom: '16px'
    },
    heroHighlight: { color: '#7DE8C0' },
    heroDesc: {
        fontSize: '16px', lineHeight: 1.7,
        opacity: 0.88, maxWidth: '600px',
        margin: '0 auto 28px'
    },
    heroButtons: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' },
    btnHeroPrimary: {
        padding: '12px 28px', background: '#fff',
        color: '#185FA5', border: 'none',
        borderRadius: '10px', fontSize: '14px',
        fontWeight: '600', cursor: 'pointer'
    },
    btnHeroGhost: {
        padding: '12px 28px',
        background: 'rgba(255,255,255,0.15)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '10px', fontSize: '14px',
        fontWeight: '500', cursor: 'pointer'
    },
    statsRow: {
        display: 'flex', justifyContent: 'center',
        gap: '40px', borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '28px'
    },
    statItem: { textAlign: 'center' },
    statValue: { fontSize: '28px', fontWeight: '700', color: '#7DE8C0' },
    statLabel: { fontSize: '12px', opacity: 0.8, marginTop: '2px' },

    // Sections
    section: { padding: '70px 20px' },
    sectionInner: { maxWidth: '1100px', margin: '0 auto', textAlign: 'center' },
    sectionTag: {
        display: 'inline-block',
        background: '#E6F1FB', color: '#185FA5',
        padding: '4px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600',
        marginBottom: '14px'
    },
    sectionTitle: {
        fontSize: '28px', fontWeight: '700',
        color: '#1a1a1a', marginBottom: '12px'
    },
    sectionDesc: {
        fontSize: '15px', color: '#666',
        maxWidth: '560px', margin: '0 auto 40px',
        lineHeight: 1.7
    },

    // Features
    featGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px', textAlign: 'left'
    },
    featCard: {
        background: '#fff', border: '1px solid #e8e8e8',
        borderRadius: '12px', padding: '22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s'
    },
    featIcon: { fontSize: '28px', marginBottom: '12px' },
    featTitle: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    featDesc: { fontSize: '13px', color: '#666', lineHeight: 1.7 },

    // Steps
    stepsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
    },
    stepCard: {
        background: '#fff', borderRadius: '12px',
        padding: '28px 22px', textAlign: 'center',
        border: '1px solid #e0e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    stepNum: {
        fontSize: '13px', fontWeight: '700',
        color: '#185FA5', marginBottom: '12px',
        background: '#E6F1FB', display: 'inline-block',
        padding: '4px 12px', borderRadius: '20px'
    },
    stepIcon: { fontSize: '32px', marginBottom: '12px' },
    stepTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    stepDesc: { fontSize: '13px', color: '#666', lineHeight: 1.7 },

    // Threshold
    thresholdGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px'
    },
    thresholdCard: {
        background: '#F8FBFF', border: '1px solid #D0E4F5',
        borderRadius: '12px', padding: '24px 16px',
        textAlign: 'center'
    },
    thresholdIcon: { fontSize: '28px', marginBottom: '10px' },
    thresholdParam: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' },
    thresholdSafe: { fontSize: '20px', fontWeight: '700', color: '#185FA5', marginBottom: '4px' },
    thresholdLabel: { fontSize: '11px', color: '#888' },

    // CTA
    cta: {
        background: 'linear-gradient(135deg, #0D3B6E, #185FA5)',
        padding: '70px 20px', textAlign: 'center', color: '#fff'
    },
    ctaInner: { maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '12px' },
    ctaDesc: { fontSize: '15px', opacity: 0.85, marginBottom: '28px' },
    ctaBtn: {
        padding: '14px 32px', background: '#fff',
        color: '#185FA5', border: 'none',
        borderRadius: '10px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer'
    },

    // Footer
    footer: { background: '#0D1B2E', padding: '36px 20px', textAlign: 'center', color: '#fff' },
    footerInner: { maxWidth: '600px', margin: '0 auto' },
    footerLogo: { fontSize: '18px', fontWeight: '700', marginBottom: '8px' },
    footerDesc: { fontSize: '13px', opacity: 0.6, marginBottom: '16px' },
    footerLinks: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' },
    footerLink: { fontSize: '13px', color: '#7DE8C0', cursor: 'pointer' },
    footerDot: { fontSize: '13px', opacity: 0.4 },
    footerCopy: { fontSize: '12px', opacity: 0.4 }
};