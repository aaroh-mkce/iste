import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiEye, HiSparkles } from 'react-icons/hi';
import './VisionMission.css';

export default function VisionMission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="vision-mission" ref={ref}>
      <div className="vision-mission__container">
        <motion.div
          className="vision-mission__card vision-mission__card--vision"
          initial={{ opacity: 0, y: 40, rotateX: 5 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
        >
          <div className="vision-mission__icon-wrap">
            <HiEye size={28} />
          </div>
          <h3>Our Vision</h3>
          <p>
            Empower students in technical education, foster innovation, collaboration, and
            continuous learning — building the technology leaders of tomorrow.
          </p>
          <div className="vision-mission__glow vision-mission__glow--purple" />
        </motion.div>

        <motion.div
          className="vision-mission__card vision-mission__card--mission"
          initial={{ opacity: 0, y: 40, rotateX: 5 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
        >
          <div className="vision-mission__icon-wrap vision-mission__icon-wrap--pink">
            <HiSparkles size={28} />
          </div>
          <h3>Our Mission</h3>
          <p>
            Drive continuous learning, innovation, and collaborative problem solving.
            Develop technical skills that prepare students for real-world engineering challenges
            through hands-on experiences and mentorship.
          </p>
          <div className="vision-mission__glow vision-mission__glow--pink" />
        </motion.div>
      </div>
    </section>
  );
}
