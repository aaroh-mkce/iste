import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Team', href: '#team' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Feedback', href: '#feedback' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="navbar__container">
        <a href="#home" className="navbar__logo" onClick={(e) => handleClick(e, '#home')}>
          <span className="navbar__logo-icon">ISTE</span>
        </a>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="navbar__link" onClick={(e) => handleClick(e, link.href)}>
              {link.name}
            </a>
          ))}
          <Link to="/admin" className="navbar__link navbar__link--admin">Admin</Link>
          <button className="navbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
        </div>

        <div className="navbar__mobile-actions">
          <button className="navbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
          <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="navbar__mobile-link"
                onClick={(e) => handleClick(e, link.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {link.name}
              </motion.a>
            ))}
            <Link to="/admin" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
              Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
