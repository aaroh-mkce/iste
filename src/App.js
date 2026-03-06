import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AdminGuard from './admin/AdminGuard';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminEvents from './admin/pages/AdminEvents';
import AdminRegistrations from './admin/pages/AdminRegistrations';
import AdminGallery from './admin/pages/AdminGallery';
import AdminTeam from './admin/pages/AdminTeam';
import AdminAnnouncements from './admin/pages/AdminAnnouncements';
import AdminCertificates from './admin/pages/AdminCertificates';
import AdminFeedback from './admin/pages/AdminFeedback';

function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a35',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Admin — protected by AdminGuard */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
    
export default App;
