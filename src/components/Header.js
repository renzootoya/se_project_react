import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import './Header.css';

const Header = ({
  isLoggedIn,
  currentUser,
  onLogout,
  onShowRegister,
  onShowLogin,
  showRegisterModal,
  setShowRegisterModal,
  showLoginModal,
  setShowLoginModal,
  onRegister,
  onLogin
}) => {
  const navigate = useNavigate();

  const getAvatarPlaceholder = () => {
    if (!currentUser?.name) return '?';
    return currentUser.name.charAt(0).toUpperCase();
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            WTWR
          </Link>
          <nav className="nav">
            {isLoggedIn ? (
              <>
                <div className="user-section">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {getAvatarPlaceholder()}
                    </div>
                  )}
                  <span className="user-name">{currentUser?.name}</span>
                </div>
                <button onClick={handleEditProfile} className="edit-profile-btn">
                  Edit Profile
                </button>
                <button onClick={onLogout} className="logout-btn">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onShowRegister}
                  className="auth-btn"
                >
                  Register
                </button>
                <button
                  onClick={onShowLogin}
                  className="auth-btn primary"
                >
                  Sign In
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={onRegister}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
      />
    </>
  );
};

export default Header;
