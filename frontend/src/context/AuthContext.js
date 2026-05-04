import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

   const login = (userData, token) => {
        // Merge với data cũ để không mất field nào
        const existing = JSON.parse(localStorage.getItem('user') || '{}');
        const merged = { ...existing, ...userData };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}