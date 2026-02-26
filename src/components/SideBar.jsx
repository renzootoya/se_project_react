import React from 'react';
import './SideBar.css';

const SideBar = ({ currentUser, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={onClose}>×</button>
        {currentUser && (
          <div className="sidebar__user">
            <p className="sidebar__user-name">{currentUser.name}</p>
            <p className="sidebar__user-email">{currentUser.email}</p>
          </div>
        )}
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
