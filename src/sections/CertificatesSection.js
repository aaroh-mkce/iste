import React from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/AnimatedSection";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon } from "../components/Icons";
import { InfiniteSentinel } from "../components/InfiniteSentinel";

export function CertificatesSection() {
  const { items, loading, hasMore, loadMore } = useInfiniteScroll("certificates", {
    order: { column: "issued_at", ascending: false },
    pageSize: 10,
  });

  return (
    <section id="certificates" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
            Achievements
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Certificates
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Recognizing excellence and participation.
          </p>
        </AnimatedSection>

        {items.length === 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">🏆</div>
            <p>Certificates will appear here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-green-500/30 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  🎓
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {cert.participant_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                </div>
                {cert.certificate_url && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                  >
                    View
                  </a>
                )}
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
