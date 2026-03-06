import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Marquee from './Marquee';
import './Hero.css';

const roles = ['Innovators', 'Engineers', 'Creators', 'Builders', 'Designers'];
const marqueeItems = [
  'WORKSHOPS', 'HACKATHONS', 'SEMINARS', 'PROJECTS', 'WEBINARS',
  'IDEATHONS', 'BOOTCAMPS', 'TECH TALKS', 'CODE JAMS', 'MENTORSHIP',
];

const stats = [
  { num: '50+', label: 'Events' },
  { num: '500+', label: 'Members' },
  { num: '10+', label: 'Years' },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      {/* Animated grid background */}
      <div className="hero__grid" />

      {/* Radial glow */}
      <div className="hero__glow" />

      {/* Floating shapes */}
      <div className="hero__shapes">
        <div className="hero__shape hero__shape--1" />
        <div className="hero__shape hero__shape--2" />
        <div className="hero__shape hero__shape--3" />
        <div className="hero__shape hero__shape--4" />
      </div>

      {/* Main content — centered */}
      <div className="hero__inner">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__badge-dot" />
          ISTE — SIST Student Chapter
        </motion.div>

        <motion.h1
          className="hero__heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__heading-top">We are the</span>
          <span className="hero__heading-role">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="hero__role"
                initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="hero__heading-bottom">of Tomorrow</span>
        </motion.h1>

        <motion.p
          className="hero__desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Sathyabama's ISTE chapter — where curiosity meets craft.
          Building the next generation of technical leaders through
          hands-on innovation and collaboration.
        </motion.p>

        <motion.div
          className="hero__cta-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <a
            href="#events"
            className="hero__cta hero__cta--primary"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Events
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#about"
            className="hero__cta hero__cta--ghost"
            onClick={(e) => {
              e.preventDefault();
              scrollToAbout();
            }}
          >
            Learn More
          </a>
        </motion.div>

        {/* Inline stats */}
        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="hero__stat">
              <span className="hero__stat-num">{s.num}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee strip */}
      <motion.div
        className="hero__marquee-zone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <Marquee speed={35} direction="left">
          {marqueeItems.map((item, i) => (
            <span key={i} className="hero__mq-item">
              {item} <span className="hero__mq-dot">·</span>
            </span>
          ))}
        </Marquee>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        className="hero__scroll-btn"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-label="Scroll to content"
      >
        <motion.div
          className="hero__scroll-icon"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
