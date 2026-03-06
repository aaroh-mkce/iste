import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { HiDownload, HiArrowLeft, HiSearch } from 'react-icons/hi';

export default function AdminEventRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetch() {
      const { data: ev } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (ev) setEvent(ev);
      let q = supabase.from('registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
      const { data } = await q;
      if (data) setRegistrations(data);
    }
    fetch();
  }, [eventId]);

  const filtered = registrations.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.college?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Department', 'Year', 'Registered At'];
    const rows = filtered.map((r) => [
      r.name, r.email, r.phone, r.college, r.department, r.year,
      new Date(r.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${event?.title || eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-page__header">
        <Link to="/admin/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '0.5rem' }}>
          <HiArrowLeft /> Back to Events
        </Link>
        <h1>Registrations{event ? ` — ${event.title}` : ''}</h1>
        <p>{filtered.length} registration{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search registrations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={exportCSV}>
          <HiDownload /> Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Department</th>
              <th>Year</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone || '—'}</td>
                <td>{r.college || '—'}</td>
                <td>{r.department || '—'}</td>
                <td>{r.year || '—'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No registrations found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
