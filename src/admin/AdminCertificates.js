import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiPlus, HiTrash, HiSearch } from 'react-icons/hi';

const emptyForm = { participant_name: '', event_id: '', certificate_url: '' };

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const { data } = await supabase.from('certificates').select('*, events(title)').order('issued_at', { ascending: false });
    if (data) setCertificates(data);
    const { data: evs } = await supabase.from('events').select('id, title').order('title');
    if (evs) setEvents(evs);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('certificates').insert([form]);
    setShowModal(false);
    setForm(emptyForm);
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    await supabase.from('certificates').delete().eq('id', id);
    fetchData();
  };

  const filtered = certificates.filter(
    (c) => c.participant_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page__header">
        <h1>Certificates</h1>
        <p>Upload and manage participant certificates</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search by participant name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowModal(true)}>
          <HiPlus /> Add Certificate
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Event</th>
              <th>Certificate URL</th>
              <th>Issued</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{c.participant_name}</td>
                <td>{c.events?.title || '—'}</td>
                <td>
                  {c.certificate_url ? (
                    <a href={c.certificate_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
                      View
                    </a>
                  ) : '—'}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.issued_at ? new Date(c.issued_at).toLocaleDateString() : '—'}</td>
                <td>
                  <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(c.id)}><HiTrash /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No certificates found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Certificate</h3>
            <form onSubmit={handleSave}>
              <div className="admin-modal__field">
                <label>Participant Name *</label>
                <input value={form.participant_name} onChange={(e) => setForm({ ...form, participant_name: e.target.value })} required />
              </div>
              <div className="admin-modal__field">
                <label>Event</label>
                <select value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}>
                  <option value="">Select event</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div className="admin-modal__field">
                <label>Certificate URL</label>
                <input value={form.certificate_url} onChange={(e) => setForm({ ...form, certificate_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
