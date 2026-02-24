import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(name, avatar);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
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
                {currentUser?.avatar && (
                  <img src={currentUser.avatar} alt="Avatar" className="avatar" />
                )}
                <div className="info-group">
                  <label>Name</label>
                  <p>{currentUser?.name}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{currentUser?.email}</p>
                </div>
              </div>
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Enter avatar URL"
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
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
