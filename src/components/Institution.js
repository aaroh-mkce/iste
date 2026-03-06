import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Marquee from './Marquee';
import './Institution.css';

const chapterStats = [
  { value: '20+', label: 'Events' },
  { value: '400+', label: 'Participants' },
  { value: '250+', label: 'Competitors' },
];

const highlights = [
  { title: 'Established 1987', desc: 'Over 35 years of academic excellence' },
  { title: 'Chennai, Tamil Nadu', desc: 'Cultural and tech hub of South India' },
  { title: 'Innovation Driven', desc: 'Industry-oriented learning curriculum' },
  { title: 'Research Focus', desc: 'Advanced labs and research facilities' },
];

const scrollTexts = ['Sathyabama', 'Engineering', 'ISTE Chapter', 'Innovation', 'Research', 'Chennai'];

export default function Institution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="institution" ref={ref}>
      <div className="institution__container">
        <motion.div
          className="institution__content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
            The university provides advanced labs and research facilities for students.
          </p>

          <div className="institution__chapter-info">
            <span className="institution__chapter-badge">ISTE-SIST Chapter • Active Since 2017</span>
            <div className="institution__chapter-stats">
              {chapterStats.map(s => (
                <div key={s.label} className="institution__chapter-stat">
                  <span className="institution__chapter-stat-value">{s.value}</span>
                  <span className="institution__chapter-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="institution__side"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              className="institution__highlight"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="institution__marquee-strip">
        <Marquee speed={35} direction="right">
          {scrollTexts.map((t, i) => (
            <span key={i} className="institution__marquee-word">{t}</span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
