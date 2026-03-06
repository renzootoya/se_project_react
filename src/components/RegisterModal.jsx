import React, { useState } from 'react';
import { signup } from '../utils/api';
import ModalWithForm from '../hooks/ModalWithForm';

const RegisterModal = ({ onClose, onSubmit, isOpen }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAvatar('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
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
    >
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
          placeholder="Enter avatar URL (optional)"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Confirm Password *</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          disabled={loading}
        />
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
