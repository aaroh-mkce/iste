import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EMPTY = { name: "", role: "", image: "", linkedin: "", priority: 99 };

function MemberForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("team").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data } = supabase.storage.from("team").getPublicUrl(path);
    setForm((p) => ({ ...p, image: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const op = initial?.id
      ? supabase.from("team_members").update(form).eq("id", initial.id)
      : supabase.from("team_members").insert(form);
    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success("Saved!"); onSave(); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-dark-700 border border-white/10 rounded-2xl w-full max-w-md overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">{initial?.id ? "Edit Member" : "Add Member"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "role", label: "Role", type: "text", required: true },
            { name: "linkedin", label: "LinkedIn URL", type: "url" },
            { name: "priority", label: "Display Order", type: "number" },
          ].map(({ name, label, type, required }) => (
            <div key={name}>
              <label className="block text-xs text-white/50 mb-1.5">{label}</label>
              <input type={type} name={name} value={form[name] || ""} onChange={handleChange} required={required}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Photo</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleImageUpload}
                className="text-sm text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-600 file:text-white file:text-xs file:cursor-pointer" />
              {uploading && <SpinnerIcon className="w-4 h-4 text-brand-400" />}
            </div>
            {form.image && <img src={form.image} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover ring-2 ring-brand-500/30" />}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMember, setFormMember] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("priority");
    setMembers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    await supabase.from("team_members").delete().eq("id", id);
    toast.success("Member removed.");
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Team Members</h1>
          <p className="text-white/40 text-sm mt-0.5">{members.length} members</p>
        </div>
        <button onClick={() => setFormMember(EMPTY)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 shadow-md">
          <PlusIcon className="w-4 h-4" /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <img
                src={m.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=4f46e5,7e22ce&textColor=ffffff`}
                alt={m.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">{m.name}</p>
                <p className="text-brand-400 text-xs">{m.role}</p>
                <p className="text-white/30 text-xs">Order: {m.priority}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setFormMember(m)} className="p-1.5 rounded-lg text-white/40 hover:text-blue-300 hover:bg-blue-500/10 transition">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {members.length === 0 && <p className="text-white/30 col-span-3 text-center py-10">No members yet.</p>}
        </div>
      )}

      <AnimatePresence>
        {formMember !== null && (
          <MemberForm initial={formMember} onSave={() => { setFormMember(null); fetch(); }} onClose={() => setFormMember(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminTeam;
