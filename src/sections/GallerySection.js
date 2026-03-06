import React from "react";
import { AnimatedSection } from "../components/AnimatedSection";
import { GalleryGrid } from "../components/GalleryGrid";
import { InfiniteSentinel } from "../components/InfiniteSentinel";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon } from "../components/Icons";

export function GallerySection() {
  const { items: images, loading, hasMore, loadMore } = useInfiniteScroll("gallery", {
    order: { column: "created_at", ascending: false },
    pageSize: 12,
  });

  return (
    <section id="gallery" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-sm font-medium mb-4">
            Memories
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Event{" "}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Snapshots from our workshops, hackathons, and more.
          </p>
        </AnimatedSection>

        {images.length === 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">🖼️</div>
            <p>Gallery photos coming soon!</p>
          </div>
        ) : (
          <GalleryGrid images={images} />
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
