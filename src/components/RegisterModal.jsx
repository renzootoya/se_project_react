import React, { useState } from 'react';
import { signup } from '../utils/api';
import './Modal.css';

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
    setLoading(true);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await signup(name, avatar, email, password);
      console.log('Signup response:', response);

      if (response.message && !response.token) {
        setError(response.message);
        setLoading(false);
        return;
      }

      if (response.token && response.user) {
        localStorage.setItem('jwt', response.token);
        resetForm();
        onSubmit(response.user);
        onClose();
      } else {
        setError('Registration failed - invalid response');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed');
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
