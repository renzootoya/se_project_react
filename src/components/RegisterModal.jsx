import React, { useState } from 'react';
import { signup } from '../utils/api';
import ModalWithForm from './ModalWithForm';

const RegisterModal = ({ onClose, onSubmit, isOpen, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await signup(name, avatar, email, password);
      if (response.token && response.user) {
        localStorage.setItem('jwt', response.token);
        resetForm();
        onSubmit(response.user);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setAvatar(''); setEmail('');
    setPassword(''); setError(''); setLoading(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

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
          <p>
            Already a member?{' '}
            <button type="button" className="modal-switch-btn" onClick={onSwitchToLogin}>
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
