import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
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
  const { currentUser: contextUser } = useContext(CurrentUserContext);
  const user = currentUser || contextUser;

  const getAvatarPlaceholder = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            WTWR
          </Link>
          <nav className="nav">
            {isLoggedIn && user ? (
              <>
                <button onClick={() => navigate('/profile')} className="nav-link">
                  Profile
                </button>
                <div className="user-section">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="avatar-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="avatar-placeholder"
                    style={{
                      display: user.avatar ? 'none' : 'flex'
                    }}
                  >
                    {getAvatarPlaceholder()}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="auth-btn logout-btn">
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
