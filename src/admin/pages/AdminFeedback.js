import React, { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { SpinnerIcon, StarIcon } from "../../components/Icons";
import { format } from "date-fns";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("feedback").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const avgRating = items.length
    ? (items.reduce((sum, f) => sum + (f.rating || 0), 0) / items.length).toFixed(1)
    : 0;

  const handleDelete = async (id) => {
    await supabase.from("feedback").delete().eq("id", id);
    setItems((prev) => prev.filter((f) => f.id !== id));
    toast.success("Deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Feedback</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {items.length} responses · Avg rating:{" "}
            <span className="text-yellow-400 font-semibold">{avgRating} ★</span>
          </p>
        </div>
      </div>

      {/* Rating distribution */}
      {items.length > 0 && (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = items.filter((f) => f.rating === star).length;
              const pct = items.length ? Math.round((count / items.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-4">{star}</span>
                  <StarIcon filled className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/40 text-xs w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{f.name || "Anonymous"}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} filled={n <= f.rating} className={`w-3.5 h-3.5 ${n <= f.rating ? "text-yellow-400" : "text-white/20"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm">{f.message}</p>
                <p className="text-white/30 text-xs mt-1">{format(new Date(f.created_at), "MMM d, yyyy")}</p>
              </div>
              <button onClick={() => handleDelete(f.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-white/30 text-center py-10">No feedback yet.</p>}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;
