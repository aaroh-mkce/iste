import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';

const emptyMember = { name: '', role: '', image: '', linkedin: '', priority: 0 };

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMember);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchTeam = async () => {
    const { data } = await supabase.from('team_members').select('*').order('priority', { ascending: true });
    if (data) setTeam(data);
  };

  useEffect(() => { fetchTeam(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyMember); setShowModal(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name || '', role: m.role || '', image: m.image || '', linkedin: m.linkedin || '', priority: m.priority || 0 });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase.from('team_members').update(form).eq('id', editing.id);
    } else {
      await supabase.from('team_members').insert([form]);
    }
    setShowModal(false);
    setLoading(false);
    fetchTeam();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    fetchTeam();
  };

  const filtered = team.filter(
    (m) => m.name?.toLowerCase().includes(search.toLowerCase()) || m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page__header">
        <h1>Team</h1>
        <p>Manage team members and roles</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <HiPlus /> Add Member
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Priority</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600, color: '#09090b' }}>{m.name}</td>
                <td>{m.role}</td>
                <td>{m.priority}</td>
                <td>{m.linkedin ? <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>Profile</a> : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(m)}><HiPencil /></button>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(m.id)}><HiTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a1a1aa', padding: '2rem' }}>No team members found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Member' : 'Add Member'}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-modal__field">
                <label>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="admin-modal__field">
                <label>Role *</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="admin-modal__field">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-modal__field">
                  <label>LinkedIn</label>
                  <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                </div>
                <div className="admin-modal__field">
                  <label>Priority (order)</label>
                  <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
