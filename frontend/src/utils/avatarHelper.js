// Màu avatar dựa theo chữ cái đầu — nhất quán ở mọi nơi
const COLORS = [
    '#185FA5', '#1D9E75', '#534AB7', '#D85A30',
    '#BA7517', '#C62828', '#0D6E8A', '#5C3D8F'
];

export function getAvatarColor(name) {
    if (!name) return '#185FA5';
    const index = name.charCodeAt(0) % COLORS.length;
    return COLORS[index];
}

export function getAvatarLetter(user) {
    if (!user) return '?';
    const name = user.fullName || user.username || '';
    return name[0]?.toUpperCase() || '?';
}

export function getAvatarSrc(user) {
    if (!user) return null;
    
    // Ưu tiên lấy từ localStorage vì context có thể chưa update
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            const storedUser = JSON.parse(stored);
            // Chỉ dùng stored nếu cùng userId
            if (storedUser.userId === user.userId && storedUser.avatarUrl) {
                return storedUser.avatarUrl;
            }
        }
    } catch {}
    
    return user?.avatarUrl || null;
}