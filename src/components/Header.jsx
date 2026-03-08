import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ToggleSwitch from './ToggleSwitch';
import './Header.css';

const Header = ({ onSignUp, onSignIn, onLogout, onAddClothes, isCelsius, onToggleTemp }) => {
  const { currentUser, isLoggedIn } = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const getAvatarPlaceholder = () => {
    if (!currentUser?.name) return '?';
    return currentUser.name.charAt(0).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo-section">
          <Link to="/" className="header__logo">
            WTWR
          </Link>
          <p className="header__date">{currentDate}</p>
        </div>

        <nav className="header__nav">
          {/* Temperature toggle: F ← toggle → C */}
          <div className="header__temp-toggle">
            <span className={`header__temp-label${!isCelsius ? ' header__temp-label_active' : ''}`}>F</span>
            <ToggleSwitch isOn={isCelsius} onChange={onToggleTemp} />
            <span className={`header__temp-label${isCelsius ? ' header__temp-label_active' : ''}`}>C</span>
          </div>

          {isLoggedIn && currentUser ? (
            <>
              {/* "Add clothes" opens the modal — NOT a navigation link */}
              <button
                type="button"
                className="header__link header__btn header__btn_type_add"
                onClick={onAddClothes}
              >
                + Add clothes
              </button>
              <Link to="/profile" className="header__user-info">
                <span className="header__username">{currentUser.name}</span>
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="header__avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="header__avatar-placeholder"
                  style={{ display: currentUser.avatar ? 'none' : 'flex' }}
                >
                  {getAvatarPlaceholder()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <button onClick={onSignUp} className="header__btn" type="button">
                Sign up
              </button>
              <button
                onClick={onSignIn}
                className="header__btn header__btn_type_login"
                type="button"
              >
                Log in
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
