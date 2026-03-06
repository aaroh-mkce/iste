import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiCalendar, HiUsers, HiPhotograph, HiChat, HiSpeakerphone, HiAcademicCap } from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0, registrations: 0, team: 0, gallery: 0, feedback: 0, announcements: 0, certificates: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const tables = [
        { key: 'events', table: 'events' },
        { key: 'registrations', table: 'registrations' },
        { key: 'team', table: 'team_members' },
        { key: 'gallery', table: 'gallery' },
        { key: 'feedback', table: 'feedback' },
        { key: 'announcements', table: 'announcements' },
        { key: 'certificates', table: 'certificates' },
      ];
      const results = {};
      for (const t of tables) {
        const { data } = await supabase.from(t.table).select('id');
        results[t.key] = data?.length || 0;
      }
      setStats(results);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Events', value: stats.events, icon: HiCalendar, color: '#6366f1' },
    { label: 'Registrations', value: stats.registrations, icon: HiUsers, color: '#8b5cf6' },
    { label: 'Team Members', value: stats.team, icon: HiUsers, color: '#a855f7' },
    { label: 'Gallery Images', value: stats.gallery, icon: HiPhotograph, color: '#ec4899' },
    { label: 'Feedback', value: stats.feedback, icon: HiChat, color: '#14b8a6' },
    { label: 'Announcements', value: stats.announcements, icon: HiSpeakerphone, color: '#f59e0b' },
    { label: 'Certificates', value: stats.certificates, icon: HiAcademicCap, color: '#22c55e' },
  ];

  return (
    <div>
      <div className="admin-page__header">
        <h1>Dashboard</h1>
        <p>Overview of ISTE Student Chapter data</p>
      </div>
      <div className="admin-stats">
        {cards.map((c) => (
          <div key={c.label} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="admin-stat-card__label">{c.label}</div>
                <div className="admin-stat-card__value">{c.value}</div>
              </div>
              <c.icon style={{ fontSize: '1.5rem', color: c.color, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
