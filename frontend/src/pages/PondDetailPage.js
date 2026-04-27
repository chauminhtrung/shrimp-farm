import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PondDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <Navbar />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
                <button
                    onClick={() => navigate('/ponds')}
                    style={{
                        padding: '6px 14px', background: '#E6F1FB',
                        color: '#185FA5', border: '1px solid #B5D4F4',
                        borderRadius: '6px', fontSize: '12px',
                        cursor: 'pointer', marginBottom: '16px'
                    }}
                >
                    ← Quay lại
                </button>
                <h2>Chi tiết ao #{id}</h2>
                <p style={{ color: '#888', marginTop: '8px' }}>
                    Đang phát triển...
                </p>
            </div>
        </div>
    );
}