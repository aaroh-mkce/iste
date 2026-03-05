import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HiPhotograph } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './Gallery.css';

const fallbackImages = [
  { id: 1, title: 'Monsoon Event 2023', category: 'Events' },
  { id: 2, title: 'IoT Workshop', category: 'Workshops' },
  { id: 3, title: 'Coding Competition', category: 'Competitions' },
  { id: 4, title: 'Team Meeting', category: 'Team' },
  { id: 5, title: 'Paper Presentation', category: 'Academic' },
  { id: 6, title: 'Award Ceremony', category: 'Events' },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [images, setImages] = useState(fallbackImages);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const categories = ['All', ...new Set(images.map((img) => img.category))];

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (data && !error && data.length > 0) {
          setImages(data);
        }
      } catch (e) {
        // Use fallback data
      }
    }
    fetchGallery();
  }, []);

  const filtered = filter === 'All' ? images : images.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="gallery" ref={ref}>
      <div className="gallery__container">
        <motion.div
          className="gallery__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Gallery</span>
          <h2 className="section-title">
            Our <span className="gradient-text">Moments</span>
          </h2>
          <p className="section-description">
            A visual journey through our events, workshops, and community activities.
          </p>
        </motion.div>

        <motion.div
          className="gallery__filters"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gallery__filter-btn ${filter === cat ? 'gallery__filter-btn--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div className="gallery__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id || i}
                className="gallery__item"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onClick={() => img.image_url && setLightbox(img)}
              >
                {img.image_url ? (
                  <img src={img.image_url} alt={img.title} className="gallery__image" />
                ) : (
                  <div className="gallery__placeholder">
                    <HiPhotograph size={40} />
                    <span>{img.title}</span>
                  </div>
                )}
                <div className="gallery__overlay">
                  <span className="gallery__item-category">{img.category}</span>
                  <span className="gallery__item-title">{img.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox.image_url}
              alt={lightbox.title}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
