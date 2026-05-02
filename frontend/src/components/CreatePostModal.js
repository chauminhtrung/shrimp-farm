import { useState } from 'react';

const TAGS = [
    { key: 'EXPERIENCE', label: '💡 Kinh nghiệm' },
    { key: 'DISEASE',    label: '🦠 Bệnh tôm' },
    { key: 'TECHNIQUE',  label: '⚙️ Kỹ thuật' },
    { key: 'QA',         label: '❓ Hỏi đáp' },
];

export default function CreatePostModal({ onClose, onCreate }) {
const [form, setForm] = useState({
    title: '', content: '', tag: 'EXPERIENCE', imageUrl: ''
});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
            return;
        }
        onCreate(form);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Đăng bài viết mới</h3>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Tiêu đề</label>
                        <input
                            style={styles.input}
                            placeholder="Nhập tiêu đề bài viết..."
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Chủ đề</label>
                        <div style={styles.tagRow}>
                            {TAGS.map(t => (
                                <button
                                    key={t.key}
                                    type="button"
                                    style={{
                                        ...styles.tagBtn,
                                        background: form.tag === t.key ? '#1D9E75' : '#f5f5f5',
                                        color: form.tag === t.key ? '#fff' : '#555',
                                        borderColor: form.tag === t.key ? '#1D9E75' : '#ddd'
                                    }}
                                    onClick={() => setForm({...form, tag: t.key})}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Nội dung</label>
                        <textarea
                            style={styles.textarea}
                            placeholder="Chia sẻ kinh nghiệm, đặt câu hỏi hoặc mô tả vấn đề của bạn..."
                            value={form.content}
                            onChange={e => setForm({...form, content: e.target.value})}
                            required
                            rows={6}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Ảnh minh họa (URL ảnh — không bắt buộc)
                        </label>
                        <input
                            style={styles.input}
                            placeholder="https://example.com/image.jpg"
                            value={form.imageUrl}
                            onChange={e => setForm({...form, imageUrl: e.target.value})}
                        />
                    </div>


                    <div style={styles.actions}>
                        <button type="button" style={styles.cancelBtn} onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" style={styles.submitBtn}>
                            Đăng bài
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000
    },
    modal: {
        background: '#fff', borderRadius: '12px',
        padding: '24px', width: '100%', maxWidth: '560px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px'
    },
    title: { fontSize: '16px', fontWeight: '600', color: '#1a1a1a' },
    closeBtn: {
        background: 'none', border: 'none',
        fontSize: '16px', cursor: 'pointer', color: '#888'
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '500', color: '#333', marginBottom: '6px'
    },
    input: {
        width: '100%', padding: '10px 12px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    },
    textarea: {
        width: '100%', padding: '10px 12px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
        resize: 'vertical', fontFamily: 'Arial, sans-serif'
    },
    tagRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    tagBtn: {
        padding: '5px 12px', border: '1px solid',
        borderRadius: '20px', fontSize: '12px',
        cursor: 'pointer', fontWeight: '500'
    },
    actions: { display: 'flex', gap: '10px', marginTop: '20px' },
    cancelBtn: {
        flex: 1, padding: '10px', background: '#f5f5f5',
        color: '#666', border: 'none', borderRadius: '8px',
        fontSize: '14px', cursor: 'pointer'
    },
    submitBtn: {
        flex: 1, padding: '10px', background: '#1D9E75',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer'
    }
};