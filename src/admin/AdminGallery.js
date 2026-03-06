import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HiPlus, HiTrash, HiPhotograph, HiSearch } from 'react-icons/hi';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ image_url: '', event_name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('gallery').insert([form]);
    setShowModal(false);
    setForm({ image_url: '', event_name: '', description: '' });
    setLoading(false);
    fetchImages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchImages();
  };

  const filtered = images.filter(
    (img) =>
      img.event_name?.toLowerCase().includes(search.toLowerCase()) ||
      img.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page__header">
        <h1>Gallery</h1>
        <p>Manage gallery images</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiSearch />
          <input placeholder="Search images..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowModal(true)}>
          <HiPlus /> Add Image
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {filtered.map((img) => (
          <div key={img.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            {img.image_url ? (
              <img src={img.image_url} alt={img.event_name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5', color: '#d4d4d8' }}>
                <HiPhotograph size={40} />
              </div>
            )}
            <div style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#09090b', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{img.event_name || 'Untitled'}</div>
              <div style={{ color: '#71717a', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{img.description || ''}</div>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(img.id)}>
                <HiTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#a1a1aa', padding: '3rem' }}>No images found</div>
      )}

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Gallery Image</h3>
            <form onSubmit={handleSave}>
              <div className="admin-modal__field">
                <label>Image URL *</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required placeholder="https://..." />
              </div>
              <div className="admin-modal__field">
                <label>Event Name</label>
                <input value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} />
              </div>
              <div className="admin-modal__field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div className="admin-modal__actions">
                <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
