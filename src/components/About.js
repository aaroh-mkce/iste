import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiAcademicCap, HiUserGroup, HiOfficeBuilding, HiBookOpen } from 'react-icons/hi';
import './About.css';

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: <HiAcademicCap />, label: 'Technical Teachers', value: 97286, suffix: '+' },
  { icon: <HiUserGroup />, label: 'Student Members', value: 566466, suffix: '+' },
  { icon: <HiOfficeBuilding />, label: 'Institutional Members', value: 2345, suffix: '+' },
  { icon: <HiBookOpen />, label: 'Student Chapters', value: 1280, suffix: '' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="about">
      <div className="about__container" ref={ref}>
        <motion.div
          className="about__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">About ISTE</span>
          <h2 className="section-title">
            What is <span className="gradient-text">ISTE</span>?
          </h2>
          <p className="section-description">
            The Indian Society for Technical Education is a national, professional, non-profit
            organization — the largest network of technical education professionals in India,
            supported by the Government to advance excellence in technical education.
          </p>
        </motion.div>

        <motion.div
          className="about__stats"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="about__stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="about__stat-icon">{stat.icon}</div>
              <div className="about__stat-value">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="about__stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="about__features"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="about__feature-card">
            <div className="about__feature-number">01</div>
            <h3>Professional Development</h3>
            <p>Developing professional engineers and technicians equipped with cutting-edge skills for the modern industry.</p>
          </div>
          <div className="about__feature-card">
            <div className="about__feature-number">02</div>
            <h3>Training Programs</h3>
            <p>Conducting comprehensive training programs to help students improve their technical learning and practical skills.</p>
          </div>
          <div className="about__feature-card">
            <div className="about__feature-number">03</div>
            <h3>Innovation & Exposure</h3>
            <p>Promoting innovation and providing technical exposure through workshops, hackathons, and expert-led sessions.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
