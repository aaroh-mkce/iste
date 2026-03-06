import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './VisionMission.css';

export default function VisionMission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="vision-mission" ref={ref}>
      <div className="vision-mission__container">
        <motion.div
          className="vision-mission__card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="vision-mission__label">Vision</span>
          <h3>Our Vision</h3>
          <p>
            Empower students in technical education, foster innovation, collaboration, and
            continuous learning — building the technology leaders of tomorrow.
          </p>
        </motion.div>

        <motion.div
          className="vision-mission__card"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="vision-mission__label vision-mission__label--pink">Mission</span>
          <h3>Our Mission</h3>
          <p>
            Drive continuous learning, innovation, and collaborative problem solving.
            Develop technical skills that prepare students for real-world engineering challenges
            through hands-on experiences and mentorship.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
