import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const CATEGORIES = ["Workshop", "Hackathon", "Seminar", "Competition"];
const EVENT_TYPES = ["Solo", "Team"];
const EMPTY_FORM = {
  title: "", description: "", event_date: "", location: "",
  poster_image: "", category: "Workshop", registration_link: "", max_participants: 100,
  event_type: "Solo", team_size: 2,
};

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("posters").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("posters").getPublicUrl(path);
    setForm((p) => ({ ...p, poster_image: urlData.publicUrl }));
    setUploading(false);
    toast.success("Poster uploaded!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial?.id) {
        const { error } = await supabase.from("events").update(form).eq("id", initial.id);
        if (error) throw error;
        toast.success("Event updated!");
      } else {
        const { error } = await supabase.from("events").insert(form);
        if (error) throw error;
        toast.success("Event created!");
      }
      onSave();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-dark-700 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white">{initial?.id ? "Edit Event" : "Create Event"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "location", label: "Location", type: "text" },
              { name: "event_date", label: "Event Date & Time", type: "datetime-local", required: true },
              { name: "max_participants", label: "Max Participants", type: "number" },
              { name: "registration_link", label: "External Registration Link", type: "url" },
            ].map(({ name, label, type, required }) => (
              <div key={name} className={name === "title" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>
                <input
                  type={type} name={name} value={form[name] || ""}
                  onChange={handleChange} required={required}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Event Type</label>
              <select name="event_type" value={form.event_type} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40">
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {form.event_type === "Team" && (
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Members per Team</label>
                <input
                  type="number" name="team_size" min={2} max={20}
                  value={form.team_size || 2} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40"
                />
                <p className="text-white/30 text-xs mt-1">Including the team leader</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Description</label>
            <textarea name="description" rows={4} value={form.description || ""} onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 resize-none" />
          </div>
          {/* Poster upload */}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Event Poster</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handlePosterUpload} className="text-sm text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-600 file:text-white file:text-xs file:cursor-pointer" />
              {uploading && <SpinnerIcon className="w-5 h-5 text-brand-400" />}
            </div>
            {form.poster_image && (
              <img src={form.poster_image} alt="Poster preview" className="mt-2 h-24 rounded-lg object-cover" />
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5 transition">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
              {saving ? "Saving…" : initial?.id ? "Update" : "Create Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formEvent, setFormEvent] = useState(null); // null=closed, {}=new, {id,...}=edit
  const [deleteId, setDeleteId] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleDelete = async () => {
    const { error } = await supabase.from("events").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); } else { toast.success("Event deleted."); fetchEvents(); }
    setDeleteId(null);
  };

  const filtered = events.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Events</h1>
          <p className="text-white/40 text-sm mt-0.5">{events.length} total events</p>
        </div>
        <button
          onClick={() => setFormEvent(EMPTY_FORM)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition shadow-md"
        >
          <PlusIcon className="w-4 h-4" /> New Event
        </button>
      </div>

      <input type="text" placeholder="Search events…" value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 placeholder-white/30" />

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                  <th className="text-left px-5 py-3">Title</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Location</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 text-white font-medium">{event.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs">{event.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white/60">{format(new Date(event.event_date), "dd MMM yyyy")}</td>
                    <td className="px-5 py-3.5 text-white/60">{event.location || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/registrations?event=${event.id}`}
                          className="p-1.5 rounded-lg text-white/40 hover:text-brand-300 hover:bg-brand-500/10 transition"
                          title="View Registrations"
                        >
                          <ClipboardDocumentListIcon className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setFormEvent(event)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-blue-300 hover:bg-blue-500/10 transition">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(event.id)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30">No events found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      <AnimatePresence>
        {formEvent !== null && (
          <EventForm
            initial={formEvent}
            onSave={() => { setFormEvent(null); fetchEvents(); }}
            onClose={() => setFormEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-dark-700 border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-semibold text-white">Delete Event?</h3>
              <p className="text-white/50 text-sm mt-2">This will also delete all registrations. This cannot be undone.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminEvents;
