import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// GitHub Pages deploys under a subdirectory (repo name) if not a user/org page.
// Using HashRouter via basename avoids 404 on direct navigation.
const basename = process.env.PUBLIC_URL || '';

function App() {
  return (
    <BrowserRouter basename={basename}>
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
    </BrowserRouter>
  );
}
    
export default App;
