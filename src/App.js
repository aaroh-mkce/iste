import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Public components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Institution from './components/Institution';
import VisionMission from './components/VisionMission';
import { EventsSection } from './components/EventDetail';
import Team from './components/Team';
import Gallery from './components/Gallery';
import Announcements from './components/Announcements';
import Certificates from './components/Certificates';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import InfiniteFeed from './components/InfiniteFeed';
import EventPage from './pages/EventPage';

// Admin components
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminEvents from './admin/AdminEvents';
import AdminEventRegistrations from './admin/AdminEventRegistrations';
import AdminRegistrations from './admin/AdminRegistrations';
import AdminGallery from './admin/AdminGallery';
import AdminTeam from './admin/AdminTeam';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminCertificates from './admin/AdminCertificates';
import AdminFeedback from './admin/AdminFeedback';

function HomePage() {
  return (
    <div className="App">
      <Navbar />
      <InfiniteFeed>
        <Hero />
        <About />
        <Institution />
        <VisionMission />
        <EventsSection />
        <Team />
        <Gallery />
        <Announcements />
        <Certificates />
        <Feedback />
      </InfiniteFeed>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="events-section__spinner" />
      </div>
    );
  }
  if (!user) return <AdminLogin />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events/:eventId" element={<EventPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="events/:eventId/registrations" element={<AdminEventRegistrations />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
