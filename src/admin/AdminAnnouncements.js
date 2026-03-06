import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';

const emptyForm = { title: '', description: '' };

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title || '', description: a.description || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase.from('announcements').update(form).eq('id', editing.id);
    } else {
      await supabase.from('announcements').insert([form]);
    }
    setShowModal(false);
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    fetchData();
  };

  const filtered = announcements.filter(
    (a) => a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page__header">
        <h1>Announcements</h1>
        <p>Post and manage announcements</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <HiPlus /> New Announcement
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{a.title}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.description}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(a)}><HiPencil /></button>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(a.id)}><HiTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No announcements</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Announcement' : 'New Announcement'}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-modal__field">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="admin-modal__field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update' : 'Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
