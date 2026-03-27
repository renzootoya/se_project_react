import React, { useState } from 'react';
import { signup, signin, checkToken } from '../utils/auth';
import ModalWithForm from './ModalWithForm';

const RegisterModal = ({ onClose, onSubmit, isOpen, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const avatarUrl = avatar.trim() || 'https://i.pravatar.cc/150';
    signup(name, avatarUrl, email, password)
      .then((response) => {
        // Backend may return {token, user} directly on signup, or just {_id,...}
        if (response.token && (response.user || response._id)) {
          localStorage.setItem('jwt', response.token);
          const user = response.user || response;
          return Promise.resolve({ _resolvedUser: user });
        }
        if (response._id || (response.user && response.user._id)) {
          return signin(email, password);
        }
        setError(response.message || 'Registration failed. Please try again.');
        setLoading(false);
        return null;
      })
      .then((response) => {
        if (!response) return null;
        // If we already resolved the user directly from signup
        if (response._resolvedUser) {
          return Promise.resolve({ _resolvedUser: response._resolvedUser });
        }
        if (response.token) {
          localStorage.setItem('jwt', response.token);
          // signin also returns {token, user}
          if (response.user) {
            return Promise.resolve({ _resolvedUser: response.user });
          }
          return checkToken(response.token);
        }
        setError(response.message || 'Login failed after registration.');
        return null;
      })
      .then((userData) => {
        if (!userData) return;
        const user = userData._resolvedUser || userData.user || userData;
        if (!user._id) return;
        resetForm();
        onSubmit(user);
      })
      .catch(() => {
        setError('Network error. Please check your connection and try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setName('');
    setAvatar('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleClose}
      title="Sign Up"
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
      loading={loading}
      error={error}
      footer={
        onSwitchToLogin ? (
          <p className="modal-footer__text">
            Already a member?{' '}
            <button
              type="button"
              className="modal-switch-btn"
              onClick={onSwitchToLogin}
            >
              Log in here
            </button>
          </p>
        ) : null
      }
    >
      <div className="form-group">
        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-avatar">Avatar URL</label>
        <input
          id="register-avatar"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Enter avatar URL (optional)"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
          required
        />
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
