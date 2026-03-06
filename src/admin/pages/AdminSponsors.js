import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

const TIERS = ["Title", "Gold", "Silver", "Bronze", "Partner"];

const TIER_COLORS = {
  Title: "bg-purple-500/20 text-purple-300",
  Gold: "bg-yellow-500/20 text-yellow-300",
  Silver: "bg-gray-400/20 text-gray-300",
  Bronze: "bg-orange-500/20 text-orange-300",
  Partner: "bg-brand-500/20 text-brand-300",
};

const EMPTY = { name: "", logo_url: "", website: "", tier: "Gold", description: "" };

function SponsorForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const isEdit = !!initial?.id;
    const payload = { name: form.name, logo_url: form.logo_url, website: form.website, tier: form.tier, description: form.description };
    const { error } = isEdit
      ? await supabase.from("sponsors").update(payload).eq("id", initial.id)
      : await supabase.from("sponsors").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(isEdit ? "Sponsor updated!" : "Sponsor added!"); onSave(); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-dark-700 border border-white/10 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">{initial?.id ? "Edit Sponsor" : "Add Sponsor"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Sponsor Name <span className="text-red-400">*</span></label>
            <input type="text" name="name" required value={form.name} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Tier</label>
            <select name="tier" value={form.tier} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-600 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40">
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Logo URL</label>
            <input type="url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Website</label>
            <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 resize-none" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50">
            {saving ? "Saving…" : initial?.id ? "Update Sponsor" : "Add Sponsor"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("sponsors").select("*").order("tier").order("name");
    setSponsors(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sponsor?")) return;
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Sponsor deleted."); fetchSponsors(); }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    fetchSponsors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Sponsors</h1>
          <p className="text-white/40 text-sm mt-0.5">{sponsors.length} sponsors</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition shadow-md">
          <PlusIcon className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : sponsors.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-white/30">
          No sponsors yet. Add your first sponsor!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TIER_COLORS[s.tier] || "bg-white/10 text-white/50"}`}>
                  {s.tier}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(s); setShowForm(true); }}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {s.logo_url && (
                <div className="bg-white rounded-xl p-3 flex items-center justify-center h-20">
                  <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{s.name}</p>
                {s.description && <p className="text-white/50 text-xs mt-1 line-clamp-2">{s.description}</p>}
              </div>
              {s.website && (
                <a href={s.website} target="_blank" rel="noopener noreferrer"
                  className="text-brand-400 text-xs hover:underline truncate">
                  {s.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <SponsorForm
            initial={editing}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminSponsors;
