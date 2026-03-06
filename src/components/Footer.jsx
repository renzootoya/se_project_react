import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          &copy; {new Date().getFullYear()} Developed by Renzo
        </p>
        <p className="footer__copyright">WTWR</p>
      </div>
    </footer>
  );
};

export default Footer;
