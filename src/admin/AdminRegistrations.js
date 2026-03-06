import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiSearch, HiEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function AdminRegistrations() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetch() {
      const { data: evs } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      if (!evs) return;
      // Get registration counts
      const results = [];
      for (const ev of evs) {
        const { data: regs } = await supabase.from('registrations').select('id').eq('event_id', ev.id);
        results.push({ ...ev, regCount: regs?.length || 0 });
      }
      setEvents(results);
    }
    fetch();
  }, []);

  const filtered = events.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-page__header">
        <h1>Registrations</h1>
        <p>View registrations per event</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{ev.title}</td>
                <td><span className="event-card__category">{ev.category}</span></td>
                <td>{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}</td>
                <td style={{ fontWeight: 700, color: '#6366f1' }}>{ev.regCount}</td>
                <td>
                  <button className="admin-btn admin-btn--outline" onClick={() => navigate(`/admin/events/${ev.id}/registrations`)}>
                    <HiEye /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No events found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
