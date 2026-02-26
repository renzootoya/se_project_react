import React from 'react';
import './SideBar.css';

const SideBar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={onClose}>×</button>
        <nav className="sidebar-nav">
          <a href="/" className="sidebar-link">Home</a>
          <a href="/profile" className="sidebar-link">Profile</a>
          <a href="/" className="sidebar-link">Clothes</a>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
