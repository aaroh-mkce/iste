import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/AnimatedSection";
import { InfiniteSentinel } from "../components/InfiniteSentinel";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon, StarIcon } from "../components/Icons";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`transition-colors ${n <= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        >
          <StarIcon filled={n <= value} className="w-7 h-7" />
        </button>
      ))}
    </div>
  );
}

export function FeedbackSection() {
  const { items, loading, hasMore, loadMore } = useInfiniteScroll("feedback", {
    order: { column: "created_at", ascending: false },
    pageSize: 6,
  });

  const [form, setForm] = useState({ name: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert(form);
      if (error) throw error;
      toast.success("Thank you for your feedback!");
      setForm({ name: "", message: "", rating: 5 });
    } catch (err) {
      toast.error("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-24 bg-white dark:bg-dark-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 text-sm font-medium mb-4">
            Your Voice
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Feedback
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Share your thoughts and help us improve.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Submit form */}
          <AnimatedSection>
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-700 border border-gray-100 dark:border-white/5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Leave a Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Anonymous"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <StarRating value={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us what you think…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Feedback"}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Recent feedback */}
          <AnimatedSection delay={0.2}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              What Others Say
            </h3>
            {items.length === 0 && !loading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Be the first to leave a review!
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((fb, i) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-100 dark:border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {fb.name || "Anonymous"}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <StarIcon
                            key={n}
                            filled={n <= fb.rating}
                            className={`w-3.5 h-3.5 ${n <= fb.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{fb.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
            {loading && <SpinnerIcon className="w-6 h-6 text-brand-500 mt-4" />}
            {hasMore && !loading && <InfiniteSentinel onVisible={loadMore} loading={loading} />}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
