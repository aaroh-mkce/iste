import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiLocationMarker, HiCalendar, HiLightBulb, HiBeaker } from 'react-icons/hi';
import './Institution.css';

export default function Institution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const highlights = [
    { icon: <HiCalendar />, title: 'Established 1987', desc: 'Over 35 years of academic excellence' },
    { icon: <HiLocationMarker />, title: 'Chennai, Tamil Nadu', desc: 'Cultural and tech hub of South India' },
    { icon: <HiLightBulb />, title: 'Innovation Driven', desc: 'Industry-oriented learning curriculum' },
    { icon: <HiBeaker />, title: 'Research Focus', desc: 'Advanced labs and research facilities' },
  ];

  return (
    <section className="institution" ref={ref}>
      <div className="institution__container">
        <motion.div
          className="institution__content"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Our Institution</span>
          <h2 className="section-title">
            Sathyabama Institute of
            <br />
            <span className="gradient-text">Science & Technology</span>
          </h2>
          <p className="institution__text">
            Sathyabama Institute of Science and Technology (SIST), established in 1987 in Chennai,
            is known for its engineering education, research focus, and innovation-driven curriculum.
            The university provides advanced labs and research facilities for students, making it an
            ideal home for the ISTE Student Chapter.
          </p>

          <div className="institution__chapter-info">
            <div className="institution__chapter-badge">ISTE-SIST Chapter • Active Since 2017</div>
            <div className="institution__chapter-stats">
              <div className="institution__chapter-stat">
                <span className="institution__chapter-stat-value">20+</span>
                <span className="institution__chapter-stat-label">Events Conducted</span>
              </div>
              <div className="institution__chapter-stat">
                <span className="institution__chapter-stat-value">400+</span>
                <span className="institution__chapter-stat-label">Participants Registered</span>
              </div>
              <div className="institution__chapter-stat">
                <span className="institution__chapter-stat-value">250+</span>
                <span className="institution__chapter-stat-label">Active Competitors</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="institution__highlights"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              className="institution__highlight-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              whileHover={{ x: 8, transition: { duration: 0.2 } }}
            >
              <div className="institution__highlight-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
