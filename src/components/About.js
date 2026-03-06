import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Marquee from './Marquee';
import './About.css';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const inc = target / 120;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { label: 'Technical Teachers', value: 97286, suffix: '+' },
  { label: 'Student Members', value: 566466, suffix: '+' },
  { label: 'Institutional Members', value: 2345, suffix: '+' },
  { label: 'Student Chapters', value: 1280, suffix: '' },
];

const scrollTexts = ['Professional Development', 'Training Programs', 'Technical Workshops', 'Innovation', 'Collaboration', 'Research', 'Engineering Excellence'];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="about">
      {/* Infinite scrolling keywords strip */}
      <div className="about__marquee-section">
        <Marquee speed={30} className="about__marquee">
          {scrollTexts.map((text, i) => (
            <span key={i} className="about__marquee-item">{text}</span>
          ))}
        </Marquee>
      </div>

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
            The Indian Society for Technical Education is the largest network of technical
            education professionals in India — a national, non-profit organization supported
            by the Government to advance excellence.
          </p>
        </motion.div>

        <motion.div
          className="about__stats"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <div className="about__stat-value">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="about__stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="about__features"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { num: '01', title: 'Professional Development', desc: 'Developing professional engineers equipped with cutting-edge skills for modern industry.' },
            { num: '02', title: 'Training Programs', desc: 'Comprehensive training to improve technical learning and practical skills of students.' },
            { num: '03', title: 'Innovation & Exposure', desc: 'Promoting innovation through workshops, hackathons, and expert-led sessions.' },
          ].map((f, i) => (
            <div key={i} className="about__feature">
              <span className="about__feature-num">{f.num}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
