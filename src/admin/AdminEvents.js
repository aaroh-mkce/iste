import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const emptyEvent = {
  title: '', description: '', event_date: '', location: '',
  poster_image: '', category: 'Workshop', registration_link: '', max_participants: 100,
};

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    let q = supabase.from('events').select('*').order('created_at', { ascending: false });
    if (search) q = q.ilike('title', `%${search}%`);
    const { data } = await q;
    if (data) setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, [search]); // eslint-disable-line

  const openCreate = () => { setEditing(null); setForm(emptyEvent); setShowModal(true); };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      event_date: ev.event_date ? ev.event_date.slice(0, 16) : '',
      location: ev.location || '',
      poster_image: ev.poster_image || '',
      category: ev.category || 'Workshop',
      registration_link: ev.registration_link || '',
      max_participants: ev.max_participants || 100,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase.from('events').update(form).eq('id', editing.id);
    } else {
      await supabase.from('events').insert([form]);
    }
    setShowModal(false);
    setLoading(false);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  return (
    <div>
      <div className="admin-page__header">
        <h1>Events</h1>
        <p>Create, edit, and manage events</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <HiPlus /> Create Event
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Max</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{ev.title}</td>
                <td><span className="event-card__category">{ev.category}</span></td>
                <td>{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}</td>
                <td>{ev.max_participants}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="admin-btn admin-btn--outline" title="View registrations" onClick={() => navigate(`/admin/events/${ev.id}/registrations`)}>
                      <HiEye />
                    </button>
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(ev)}>
                      <HiPencil />
                    </button>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(ev.id)}>
                      <HiTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No events found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-modal__field">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="admin-modal__field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-modal__field">
                  <label>Date & Time</label>
                  <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                </div>
                <div className="admin-modal__field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Workshop</option>
                    <option>Hackathon</option>
                    <option>Seminar</option>
                    <option>Competition</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal__field">
                <label>Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="admin-modal__field">
                <label>Poster Image URL</label>
                <input value={form.poster_image} onChange={(e) => setForm({ ...form, poster_image: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-modal__field">
                  <label>Registration Link</label>
                  <input value={form.registration_link} onChange={(e) => setForm({ ...form, registration_link: e.target.value })} />
                </div>
                <div className="admin-modal__field">
                  <label>Max Participants</label>
                  <input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
