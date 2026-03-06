import React from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/AnimatedSection";
import { InfiniteSentinel } from "../components/InfiniteSentinel";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon } from "../components/Icons";
import { format } from "date-fns";
import { BellIcon } from "@heroicons/react/24/outline";

export function AnnouncementsSection() {
  const { items, loading, hasMore, loadMore } = useInfiniteScroll("announcements", {
    order: { column: "created_at", ascending: false },
    pageSize: 5,
  });

  return (
    <section id="announcements" className="py-24 bg-white dark:bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-4">
            Updates
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Announcements
          </h2>
        </AnimatedSection>

        {items.length === 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">📢</div>
            <p>No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-600/5 to-purple-600/5 border border-brand-500/20 hover:border-brand-500/40 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <BellIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-8">
            <SpinnerIcon className="w-8 h-8 text-brand-500" />
          </div>
        )}

        {hasMore && !loading && <InfiniteSentinel onVisible={loadMore} loading={loading} />}
      </div>
    </section>
  );
}
