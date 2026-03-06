import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("announcements").insert(form);
    if (error) toast.error(error.message);
    else { toast.success("Announcement posted!"); setForm({ title: "", description: "" }); setShowForm(false); fetch(); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Deleted.");
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Announcements</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} announcements</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 shadow-md">
          <PlusIcon className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                {item.description && <p className="text-white/50 text-xs mt-1">{item.description}</p>}
                <p className="text-white/30 text-xs mt-1">{format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
              </div>
              <button onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0">
                <TrashIcon className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          {items.length === 0 && <p className="text-white/30 text-center py-10">No announcements yet.</p>}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-dark-700 border border-white/10 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white">New Announcement</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Title <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
                    {saving ? "Posting…" : "Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminAnnouncements;
