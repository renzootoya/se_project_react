import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditProfileModal = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:3000/api'}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, avatar })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }

      onUpdateProfile(name, avatar);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setAvatar(currentUser?.avatar || '');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter avatar URL (optional)"
            />
          </div>
          {avatar && (
            <div className="avatar-preview">
              <img src={avatar} alt="Avatar Preview" className="preview-img" />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
