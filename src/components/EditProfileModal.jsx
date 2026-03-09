import React, { useState, useEffect, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { updateUser } from '../utils/api';
import ModalWithForm from './ModalWithForm';

const EditProfileModal = ({ isOpen, onClose, onUpdateProfile }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setError('');
      setSuccess('');
    }
  }, [currentUser, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    updateUser(token, name, avatar)
      .then((data) => {
        if (data.message && !data.user) {
          setError(data.message || 'Failed to update profile');
          return;
        }
        setSuccess('Profile updated successfully!');
        onUpdateProfile(data.user || { ...currentUser, name, avatar });
        setTimeout(() => {
          onClose();
        }, 1500);
      })
      .catch(() => {
        setError('Failed to update profile');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setAvatar(currentUser?.avatar || '');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Profile"
      onSubmit={handleSubmit}
      submitButtonText="Save Changes"
      loading={loading}
      error={error}
      success={success}
    >
      <div className="form-group">
        <label htmlFor="edit-name">Name</label>
        <input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-avatar">Avatar URL</label>
        <input
          id="edit-avatar"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Enter avatar URL (optional)"
          disabled={loading}
        />
      </div>
      {avatar && (
        <div className="avatar-preview">
          <img
            src={avatar}
            alt="Avatar Preview"
            className="preview-img"
            onError={(e) => {
              e.target.alt = 'Invalid URL';
            }}
          />
        </div>
      )}
    </ModalWithForm>
  );
};

export default EditProfileModal;
