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
  onShowAddItem,
  showRegisterModal,
  setShowRegisterModal,
  showLoginModal,
  setShowLoginModal,
  onRegister,
  onLogin,
  onToggleSidebar
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getAvatarPlaceholder = () => {
    if (!currentUser?.name) return '?';
    return currentUser.name.charAt(0).toUpperCase();
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <button 
            className="menu-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Link to="/" className="logo">
            WTWR
          </Link>
          <nav className="nav">
            {isLoggedIn && currentUser ? (
              <>
                <button 
                  onClick={onShowAddItem} 
                  className="add-item-btn"
                  disabled={isLoggingOut}
                >
                  + Add Item
                </button>
                <div className="user-section">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
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
                      display: currentUser.avatar ? 'none' : 'flex'
                    }}
                  >
                    {getAvatarPlaceholder()}
                  </div>
                  <span className="user-name">{currentUser.name}</span>
                </div>
                <button 
                  onClick={handleEditProfile} 
                  className="edit-profile-btn"
                  disabled={isLoggingOut}
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
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
