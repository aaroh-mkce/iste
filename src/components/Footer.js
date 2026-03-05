import React from 'react';
import { HiHeart, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
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

export default function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-text">ISTE</span>
              <span className="footer__logo-sub">SIST Student Chapter</span>
            </div>
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
            <h4>Quick Links</h4>
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
            <div className="footer__contact-item">
              <HiLocationMarker />
              <span>Sathyabama Institute, Chennai, Tamil Nadu</span>
            </div>
            <div className="footer__contact-item">
              <HiMail />
              <span>iste@sathyabama.ac.in</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} ISTE-SIST Student Chapter. Made with{' '}
            <HiHeart className="footer__heart" /> for technical education.
          </p>
        </div>
      </div>
    </footer>
  );
}
