import { getAvatarColor, getAvatarLetter } from '../utils/avatarHelper';

export default function Avatar({ user, size = 36, onClick }) {
    // Lấy avatarUrl mới nhất từ localStorage
    let avatarUrl = user?.avatarUrl;
    try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        if (stored.userId === user?.userId && stored.avatarUrl) {
            avatarUrl = stored.avatarUrl;
        }
    } catch {}

    return avatarUrl ? (
        <img
            src={avatarUrl}
            alt="avatar"
            onClick={onClick}
            style={{
                width: size, height: size,
                borderRadius: '50%', objectFit: 'cover',
                flexShrink: 0,
                cursor: onClick ? 'pointer' : 'default',
                border: '2px solid #f0f0f0'
            }}
            onError={e => e.target.style.display = 'none'}
        />
    ) : (
        <div
            onClick={onClick}
            style={{
                width: size, height: size,
                borderRadius: '50%',
                background: getAvatarColor(user?.username),
                color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: size * 0.38,
                fontWeight: '600', flexShrink: 0,
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            {getAvatarLetter(user)}
        </div>
    );
}