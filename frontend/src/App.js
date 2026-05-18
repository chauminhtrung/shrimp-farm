import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PondListPage from './pages/PondListPage';
import PondDetailPage from './pages/PondDetailPage';
import LandingPage from './pages/LandingPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import PondMapPage from './pages/PondMapPage';


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
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/profile" element={
                        <PrivateRoute><ProfilePage /></PrivateRoute>
                    } />

                    <Route path="/community/:id" element={<PostDetailPage />} />
                    <Route path="/ponds" element={
                        <PrivateRoute><PondListPage /></PrivateRoute>
                    } />
                    <Route path="/ponds/:id" element={
                        <PrivateRoute><PondDetailPage /></PrivateRoute>
                    } />
                    <Route path="/ponds/:id/map" element={<PondMapPage />} />
                    // Thêm route — chỉ Admin mới vào được
                    <Route path="/admin" element={
                        <PrivateRoute><AdminPage /></PrivateRoute>
                    } />





                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;