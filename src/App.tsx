import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DatabaseProvider } from './contexts/DatabaseContext';

// Public Pages
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import News from './pages/public/News';
import Contact from './pages/public/Contact';
import Gallery from './pages/public/Gallery';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import AboutManagement from './pages/admin/AboutManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import SocialMediaManagement from './pages/admin/SocialMediaManagement';
import EmergencyManagement from './pages/admin/EmergencyManagement';
import PagesManagement from './pages/admin/PagesManagement';
import UsersManagement from './pages/admin/UsersManagement';
import IncidentReports from './pages/admin/IncidentReports';
import Settings from './pages/admin/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="news" element={<News />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="emergency" element={<EmergencyManagement />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="services" element={<ServicesManagement />} />
                <Route path="about" element={<AboutManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="social" element={<SocialMediaManagement />} />
                <Route path="pages" element={<PagesManagement />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="incidents" element={<IncidentReports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;