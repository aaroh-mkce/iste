import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

const highlights = [
  { icon: '🎯', text: 'Professional development for technical educators' },
  { icon: '🔬', text: 'Research & innovation through workshops and hackathons' },
  { icon: '🤝', text: 'Industry-academia collaboration and networking' },
  { icon: '🏆', text: 'National level competitions and technical events' },
];

const stats = [
  { label: 'Teachers', value: 97286, suffix: '+' },
  { label: 'Students', value: 566466, suffix: '+' },
  { label: 'Institutions', value: 2345, suffix: '+' },
  { label: 'Chapters', value: 1280, suffix: '' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="about" className="about">
      <div className="about__container" ref={ref}>
        {/* Split layout */}
        <div className="about__split">
          {/* Left — content */}
          <motion.div
            className="about__left"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about__tag">About ISTE</span>
            <h2 className="about__title">
              India's Largest{' '}
              <span className="about__title-accent">Technical Education</span>{' '}
              Network
            </h2>
            <p className="about__desc">
              The Indian Society for Technical Education is a national, non-profit
              organization backed by the Government of India — connecting educators,
              students, and institutions to advance engineering excellence.
            </p>

            <div className="about__highlights">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  className="about__highlight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <span className="about__highlight-icon">{h.icon}</span>
                  <span className="about__highlight-text">{h.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — logo showcase */}
          <motion.div
            className="about__right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__logo-wrapper">
              <div className="about__logo-ring about__logo-ring--outer" />
              <div className="about__logo-ring about__logo-ring--inner" />
              <div className="about__logo-glow" />
              <img
                src="/logo512.png"
                alt="ISTE SIST Student Chapter"
                className="about__logo-img"
              />
              {/* Floating orbit dots */}
              <div className="about__orbit">
                <div className="about__orbit-dot about__orbit-dot--1" />
                <div className="about__orbit-dot about__orbit-dot--2" />
                <div className="about__orbit-dot about__orbit-dot--3" />
              </div>
            </div>
            <span className="about__est">Est. 2015</span>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="about__stats"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="about__stat"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
            >
              <div className="about__stat-value">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="about__stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
