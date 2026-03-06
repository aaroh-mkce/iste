import React from "react";
import { AnimatedSection } from "../components/AnimatedSection";
import { TeamCard } from "../components/TeamCard";
import { InfiniteSentinel } from "../components/InfiniteSentinel";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon } from "../components/Icons";

export function TeamSection() {
  const { items: members, loading, hasMore, loadMore } = useInfiniteScroll("team_members", {
    order: { column: "priority", ascending: true },
    pageSize: 12,
  });

  return (
    <section id="team" className="py-24 bg-white dark:bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
            Our People
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Meet the{" "}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            The dedicated individuals who make ISTE Chapter a vibrant community.
          </p>
        </AnimatedSection>

        {members.length === 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <p>Team members coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
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
