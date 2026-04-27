import { useState } from 'react';

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
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Tạo ao nuôi mới</h3>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {[
                        { key: 'name', label: 'Tên ao', placeholder: 'Ao 1' },
                        { key: 'location', label: 'Vị trí', placeholder: 'Khu A' },
                        { key: 'area', label: 'Diện tích (m²)', placeholder: '500' },
                    ].map(f => (
                        <div key={f.key} style={styles.field}>
                            <label style={styles.label}>{f.label}</label>
                            <input
                                style={styles.input}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={e => setForm({...form, [f.key]: e.target.value})}
                                required={f.key !== 'location'}
                            />
                        </div>
                    ))}

                    <div style={styles.actions}>
                        <button type="button" style={styles.cancelBtn} onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" style={styles.submitBtn}>
                            Tạo ao
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
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: '#fff', borderRadius: '12px',
        padding: '24px', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
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
    field: { marginBottom: '14px' },
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '500', color: '#333', marginBottom: '5px'
    },
    input: {
        width: '100%', padding: '9px 12px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    },
    actions: {
        display: 'flex', gap: '10px', marginTop: '20px'
    },
    cancelBtn: {
        flex: 1, padding: '10px',
        background: '#f5f5f5', color: '#666',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', cursor: 'pointer'
    },
    submitBtn: {
        flex: 1, padding: '10px',
        background: '#185FA5', color: '#fff',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer'
    }
};