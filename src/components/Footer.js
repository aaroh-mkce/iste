import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import Marquee from './Marquee';
import './Footer.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Feedback', href: '#feedback' },
];

const marqueeWords = ['ISTE', 'SIST', 'INNOVATE', 'BUILD', 'LEARN', 'CREATE', 'ENGINEER', 'COLLABORATE'];

export default function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__marquee-strip">
        <Marquee speed={30} direction="left">
          {marqueeWords.map((word, i) => (
            <span key={i} className="footer__marquee-word">
              {word} <span className="footer__marquee-dot">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">ISTE</span>
            <p className="footer__tagline">
              Empowering future engineers through innovation, collaboration, and technical excellence.
            </p>
            <div className="footer__socials">
              <a href="https://instagram.com" className="footer__social" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" className="footer__social" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://github.com" className="footer__social" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            </div>
          </div>

          <div className="footer__links-section">
            <h4>Links</h4>
            <ul>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={(e) => handleClick(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__contact-section">
            <h4>Contact</h4>
            <p>Sathyabama Institute, Chennai, Tamil Nadu</p>
            <p>iste@sathyabama.ac.in</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} ISTE-SIST Student Chapter</p>
        </div>
      </div>
    </footer>
  );
}
