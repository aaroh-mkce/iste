import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * InfiniteFeed — wraps children sections and lazily reveals them
 * as the user scrolls down, giving a "social feed" feel.
 */
export default function InfiniteFeed({ children }) {
  const sections = React.Children.toArray(children);
  const [visible, setVisible] = useState(3); // Start with first 3 sections
  const loaderRef = useRef(null);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + 2, sections.length));
  }, [sections.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="infinite-feed">
      {sections.slice(0, visible).map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {section}
        </motion.div>
      ))}
      {visible < sections.length && (
        <div ref={loaderRef} style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="events-section__spinner" />
        </div>
      )}
    </div>
  );
}
