import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiHome, HiCalendar, HiClipboardList, HiPhotograph,
  HiUsers, HiSpeakerphone, HiAcademicCap, HiChat,
  HiLogout, HiMenuAlt2, HiX,
} from 'react-icons/hi';
import './AdminLayout.css';

const sidebarItems = [
  { to: '/admin', icon: HiHome, label: 'Dashboard', end: true },
  { to: '/admin/events', icon: HiCalendar, label: 'Events' },
  { to: '/admin/registrations', icon: HiClipboardList, label: 'Registrations' },
  { to: '/admin/gallery', icon: HiPhotograph, label: 'Gallery' },
  { to: '/admin/team', icon: HiUsers, label: 'Team' },
  { to: '/admin/announcements', icon: HiSpeakerphone, label: 'Announcements' },
  { to: '/admin/certificates', icon: HiAcademicCap, label: 'Certificates' },
  { to: '/admin/feedback', icon: HiChat, label: 'Feedback' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="admin-layout__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__logo">ISTE</span>
          <span className="admin-sidebar__label">Admin</span>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <HiX />
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span>{user?.email?.split('@')[0]}</span>
          </div>
          <button className="admin-sidebar__signout" onClick={handleSignOut}>
            <HiLogout /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" onClick={() => setSidebarOpen(true)}>
            <HiMenuAlt2 />
          </button>
          <NavLink to="/" className="admin-topbar__home">← Back to Site</NavLink>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
