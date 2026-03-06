import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { SpinnerIcon } from "../../components/Icons";
import { TrashIcon } from "@heroicons/react/24/outline";

export function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ event_name: "", description: "" });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setImages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) { toast.error(`Gallery upload failed: ${upErr.message}`); continue; }
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("gallery").insert({
        image_url: urlData.publicUrl,
        event_name: form.event_name,
        description: form.description,
      });
      if (dbErr) toast.error("Failed to save image record.");
    }
    toast.success("Images uploaded!");
    setUploading(false);
    e.target.value = "";
    fetchImages();
  };

  const handleDelete = async (img) => {
    const path = img.image_url.split("/gallery/")[1];
    await supabase.storage.from("gallery").remove([path]);
    await supabase.from("gallery").delete().eq("id", img.id);
    toast.success("Image deleted.");
    fetchImages();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-white">Gallery</h1>
        <p className="text-white/40 text-sm mt-0.5">{images.length} images</p>
      </div>

      {/* Upload panel */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="font-semibold text-white text-sm">Upload Images</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Event Name (optional)</label>
            <input type="text" value={form.event_name} onChange={(e) => setForm((p) => ({ ...p, event_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 placeholder-white/30"
              placeholder="e.g. Hackathon 2025" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Caption (optional)</label>
            <input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 placeholder-white/30"
              placeholder="Short description" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" multiple onChange={handleUpload}
            className="text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-brand-600 file:to-purple-600 file:text-white file:text-xs file:cursor-pointer file:font-medium" />
          {uploading && <SpinnerIcon className="w-5 h-5 text-brand-400" />}
        </div>
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">🖼️</div>
          <p>No images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="relative group rounded-xl overflow-hidden aspect-square bg-white/5">
              <img src={img.image_url} alt={img.event_name || "Gallery"} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {img.event_name && <p className="text-white text-xs font-medium text-center">{img.event_name}</p>}
                <button onClick={() => handleDelete(img)}
                  className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminGallery;
