import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiTrash, HiSearch, HiStar } from 'react-icons/hi';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (data) setFeedback(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    await supabase.from('feedback').delete().eq('id', id);
    fetchData();
  };

  const filtered = feedback.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.message?.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = filtered.length > 0
    ? (filtered.reduce((sum, f) => sum + (f.rating || 0), 0) / filtered.filter(f => f.rating).length).toFixed(1)
    : '—';

  return (
    <div>
      <div className="admin-page__header">
        <h1>Feedback</h1>
        <p>View and manage user feedback</p>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Feedback</div>
          <div className="admin-stat-card__value">{feedback.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Avg Rating</div>
          <div className="admin-stat-card__value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {avgRating} <HiStar style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">5-Star Ratings</div>
          <div className="admin-stat-card__value">{feedback.filter(f => f.rating === 5).length}</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Message</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{f.name}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.message}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <HiStar key={s} style={{ color: s <= (f.rating || 0) ? '#f59e0b' : '#e4e4e7', fontSize: '0.85rem' }} />
                    ))}
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(f.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(f.id)}><HiTrash /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No feedback found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
