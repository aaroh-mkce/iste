import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/AnimatedSection";
import supabase from "../lib/supabaseClient";

const TIER_ORDER = ["Title", "Gold", "Silver", "Bronze", "Partner"];

const TIER_STYLES = {
  Title: { badge: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300", size: "h-20" },
  Gold: { badge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300", size: "h-16" },
  Silver: { badge: "bg-gray-100 dark:bg-gray-400/20 text-gray-600 dark:text-gray-300", size: "h-14" },
  Bronze: { badge: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300", size: "h-12" },
  Partner: { badge: "bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300", size: "h-12" },
};

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("*")
      .order("tier")
      .order("name")
      .then(({ data }) => {
        setSponsors(data || []);
        setLoading(false);
      });
  }, []);

  if (!loading && sponsors.length === 0) return null;

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    const group = sponsors.filter((s) => s.tier === tier);
    if (group.length) acc[tier] = group;
    return acc;
  }, {});

  return (
    <section id="sponsors" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Sponsors
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you to our incredible sponsors who make our events possible.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([tier, items]) => (
              <div key={tier}>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TIER_STYLES[tier]?.badge || "bg-gray-100 text-gray-600"}`}>
                    {tier} Sponsor{items.length > 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/5" />
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {items.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer"
                          className="block p-5 rounded-2xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-brand-500/30 transition-all group">
                          <SponsorCard sponsor={s} tier={tier} />
                        </a>
                      ) : (
                        <div className="p-5 rounded-2xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-white/5 shadow-sm">
                          <SponsorCard sponsor={s} tier={tier} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SponsorCard({ sponsor, tier }) {
  const logoSize = TIER_STYLES[tier]?.size || "h-12";
  return (
    <div className="flex flex-col items-center gap-3 w-36 text-center">
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className={`${logoSize} w-auto max-w-[120px] object-contain`}
        />
      ) : (
        <div className={`${logoSize} w-24 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center`}>
          <span className="text-2xl">🤝</span>
        </div>
      )}
      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{sponsor.name}</p>
    </div>
  );
}

export default SponsorsSection;
