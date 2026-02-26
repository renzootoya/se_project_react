import React, { useState } from 'react';
import { signup } from '../utils/auth';
import './Modal.css';
import './RegisterModal.css';

const RegisterModal = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (avatar && !/^https?:\/\/.+/.test(avatar)) {
      errors.avatar = 'Avatar must be a valid URL';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await signup(name, avatar, email, password);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.token) {
        localStorage.setItem('jwt', response.token);
        onRegister(name, avatar, email, password);
        onClose();
        resetForm();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
            {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
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
            {validationErrors.avatar && <span className="field-error">{validationErrors.avatar}</span>}
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
            {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
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
            {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
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
            {validationErrors.confirmPassword && <span className="field-error">{validationErrors.confirmPassword}</span>}
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
