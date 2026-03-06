import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  HomeIcon,
  CalendarIcon,
  PhotoIcon,
  UsersIcon,
  BellIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { to: "/admin", icon: HomeIcon, label: "Dashboard", end: true },
  { to: "/admin/events", icon: CalendarIcon, label: "Events" },
  { to: "/admin/registrations", icon: ClipboardDocumentListIcon, label: "Registrations" },
  { to: "/admin/gallery", icon: PhotoIcon, label: "Gallery" },
  { to: "/admin/team", icon: UsersIcon, label: "Team" },
  { to: "/admin/announcements", icon: BellIcon, label: "Announcements" },
  { to: "/admin/sponsors", icon: StarIcon, label: "Sponsors" },
  { to: "/admin/feedback", icon: ChatBubbleLeftIcon, label: "Feedback" },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? "w-64" : "w-64"} flex flex-col h-full bg-dark-800 border-r border-white/5`}>
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">IS</span>
        </div>
        <div>
          <div className="font-semibold text-white text-sm">ISTE Admin</div>
          <div className="text-white/40 text-xs truncate max-w-[140px]">{user?.email}</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/50">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-brand-600/30 to-purple-600/20 text-brand-300 border border-brand-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute left-0 top-0 bottom-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 bg-dark-800/80 backdrop-blur-sm flex items-center px-4 gap-3 flex-shrink-0">
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="text-white/50 text-xs">{user?.email}</div>
        </header>

        {/* Page outlet */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
