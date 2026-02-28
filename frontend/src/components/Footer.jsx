import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>&copy; {currentYear} WTWR - What to Wear. All rights reserved.</p>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/profile">Profile</a>
            <a href="/">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
