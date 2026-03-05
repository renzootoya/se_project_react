import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../utils/api';
import ClothesSection from '../components/ClothesSection';
import AddItemModal from '../components/AddItemModal';
import './Profile.css';

const Profile = ({ currentUser, onUpdateProfile, onLogout, clothingItems, onCardLike, onDeleteItem, onAddItem }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const data = await updateUser(token, name, avatar);

      if (data.message && !data.user) {
        setError(data.message || 'Failed to update profile');
        setLoading(false);
        return;
      }

      setSuccess('Profile updated successfully!');
      onUpdateProfile(data.user || { ...currentUser, name, avatar });
      setTimeout(() => {
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setAvatar(currentUser?.avatar || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('jwt');
      onLogout();
      navigate('/');
    }
  };

  if (!currentUser) {
    return <div className="profile-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-content">
          {!isEditing ? (
            <>
              <div className="profile-info">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="avatar"
                  />
                ) : null}
                <div className="info-group">
                  <label>Name</label>
                  <p>{currentUser.name}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{currentUser.email}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="signout-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Enter avatar URL"
                  disabled={loading}
                />
              </div>
              {avatar && (
                <div className="avatar-preview">
                  <img src={avatar} alt="Avatar Preview" className="avatar" />
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading} className="save-btn">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} disabled={loading} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="clothes-section-wrapper">
        <div className="clothes-section-header">
          <h2>My Clothes</h2>
          <button className="add-item-btn" onClick={() => setIsAddModalOpen(true)}>
            + Add New Item
          </button>
        </div>
        <ClothesSection
          clothingItems={clothingItems || []}
          onCardLike={onCardLike}
          isLoggedIn={true}
          onDelete={onDeleteItem}
        />
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={onAddItem}
      />
    </div>
  );
};

export default Profile;
