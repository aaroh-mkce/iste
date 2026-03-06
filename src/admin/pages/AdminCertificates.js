import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

const EMPTY = { participant_name: "", event_id: "", certificate_url: "" };

function CertForm({ onSave, onClose, events }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("certificates").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data } = supabase.storage.from("certificates").getPublicUrl(path);
    setForm((p) => ({ ...p, certificate_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, event_id: form.event_id || null };
    const { error } = await supabase.from("certificates").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Certificate issued!"); onSave(); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-dark-700 border border-white/10 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">Issue Certificate</h2>
          <button onClick={onClose} className="text-white/40"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Participant Name <span className="text-red-400">*</span></label>
            <input type="text" required value={form.participant_name} onChange={(e) => setForm((p) => ({ ...p, participant_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Event (optional)</label>
            <select value={form.event_id} onChange={(e) => setForm((p) => ({ ...p, event_id: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-600 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40">
              <option value="">None</option>
              {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Certificate File</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="application/pdf,image/*" onChange={handleUpload}
                className="text-sm text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-600 file:text-white file:text-xs file:cursor-pointer" />
              {uploading && <SpinnerIcon className="w-4 h-4 text-brand-400" />}
            </div>
            {form.certificate_url && (
              <p className="text-green-400 text-xs mt-1">✓ Uploaded</p>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {saving ? "Issuing…" : "Issue"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: c }, { data: e }] = await Promise.all([
      supabase.from("certificates").select("*, events(title)").order("issued_at", { ascending: false }),
      supabase.from("events").select("id,title"),
    ]);
    setCerts(c || []);
    setEvents(e || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    await supabase.from("certificates").delete().eq("id", id);
    toast.success("Deleted.");
    fetchAll();
  };

  const filtered = certs.filter((c) => !search || c.participant_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Certificates</h1>
          <p className="text-white/40 text-sm mt-0.5">{certs.length} issued</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 shadow-md">
          <PlusIcon className="w-4 h-4" /> Issue Certificate
        </button>
      </div>

      <input type="text" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 placeholder-white/30" />

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                {["Participant", "Event", "Issued At", "Certificate", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-3.5 text-white font-medium">{c.participant_name}</td>
                  <td className="px-5 py-3.5 text-white/60">{c.events?.title || "—"}</td>
                  <td className="px-5 py-3.5 text-white/50 text-xs">{format(new Date(c.issued_at), "dd MMM yyyy")}</td>
                  <td className="px-5 py-3.5">
                    {c.certificate_url ? (
                      <a href={c.certificate_url} target="_blank" rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300 text-xs underline">View</a>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30">No certificates yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showForm && <CertForm events={events} onSave={() => { setShowForm(false); fetchAll(); }} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default AdminCertificates;
