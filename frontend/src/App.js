import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PondListPage from './pages/PondListPage';
import PondDetailPage from './pages/PondDetailPage';

// Route chỉ vào được khi đã đăng nhập
function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/ponds" element={
                        <PrivateRoute><PondListPage /></PrivateRoute>
                    } />
                    <Route path="/ponds/:id" element={
                        <PrivateRoute><PondDetailPage /></PrivateRoute>
                    } />
                    <Route path="/" element={<Navigate to="/ponds" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;