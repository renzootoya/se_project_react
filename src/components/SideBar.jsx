import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import './SideBar.css';

const SideBar = ({ onEditProfile, onSignOut }) => {
  const { currentUser } = useContext(CurrentUserContext);

  const getAvatarPlaceholder = () => {
    if (!currentUser?.name) return '?';
    return currentUser.name.charAt(0).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__user-info">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="sidebar__avatar"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="sidebar__avatar-placeholder">
            {getAvatarPlaceholder()}
          </div>
        )}
        <p className="sidebar__username">{currentUser?.name}</p>
      </div>
      <div className="sidebar__actions">
        <button className="sidebar__link" onClick={onEditProfile}>
          Edit profile
        </button>
        <button className="sidebar__link" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
