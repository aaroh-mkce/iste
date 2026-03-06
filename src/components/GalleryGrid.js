import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function GalleryGrid({ images }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden"
            onClick={() => setSelected(img)}
          >
            <img
              src={img.image_url}
              alt={img.event_name || "Gallery"}
              className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-3">
              <div>
                {img.event_name && (
                  <p className="text-white text-xs font-semibold">{img.event_name}</p>
                )}
                {img.description && (
                  <p className="text-white/80 text-xs mt-0.5 line-clamp-2">{img.description}</p>
                )}
              </div>
              <MagnifyingGlassIcon className="w-5 h-5 text-white absolute top-3 right-3" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.image_url}
                alt={selected.event_name || "Gallery"}
                className="rounded-xl max-h-[80vh] object-contain w-full"
              />
              {(selected.event_name || selected.description) && (
                <div className="mt-3 text-center">
                  {selected.event_name && (
                    <p className="text-white font-semibold">{selected.event_name}</p>
                  )}
                  {selected.description && (
                    <p className="text-white/70 text-sm mt-1">{selected.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GalleryGrid;
