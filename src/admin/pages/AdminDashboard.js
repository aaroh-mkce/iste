import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import { SpinnerIcon } from "../../components/Icons";
import {
  CalendarIcon,
  UsersIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const STAT_CARDS = [
  { label: "Events", icon: CalendarIcon, table: "events", color: "from-blue-500 to-indigo-600", link: "/admin/events" },
  { label: "Registrations", icon: UsersIcon, table: "registrations", color: "from-brand-500 to-purple-600", link: "/admin/registrations" },
  { label: "Gallery Photos", icon: PhotoIcon, table: "gallery", color: "from-pink-500 to-rose-600", link: "/admin/gallery" },
  { label: "Team Members", icon: UsersIcon, table: "team_members", color: "from-amber-500 to-orange-600", link: "/admin/team" },
  { label: "Certificates", icon: AcademicCapIcon, table: "certificates", color: "from-green-500 to-teal-600", link: "/admin/certificates" },
  { label: "Feedback", icon: ChatBubbleLeftIcon, table: "feedback", color: "from-violet-500 to-purple-600", link: "/admin/feedback" },
];

export function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const results = await Promise.all(
        STAT_CARDS.map(({ table }) =>
          supabase.from(table).select("id", { count: "exact", head: true })
        )
      );

      const s = {};
      STAT_CARDS.forEach(({ table }, i) => {
        s[table] = results[i].count || 0;
      });
      setStats(s);

      const { data } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })
        .limit(5);
      setRecentEvents(data || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <SpinnerIcon className="w-8 h-8 text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ label, icon: Icon, table, color, link }, i) => (
          <motion.div
            key={table}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={link}
              className="block p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/40 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stats[table]}</div>
              <div className="text-xs text-white/50 mt-0.5">{label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Events</h2>
          <Link to="/admin/events" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">{event.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">
                    {new Date(event.event_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{event.location || "—"}</td>
                </tr>
              ))}
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-white/40">
                    No events yet. <Link to="/admin/events" className="text-brand-400">Create one →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
