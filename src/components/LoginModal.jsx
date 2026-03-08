import React, { useState } from 'react';
import { signin } from '../utils/api';
import ModalWithForm from './ModalWithForm';

const LoginModal = ({ onClose, onSubmit, isOpen, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await signin(email, password);
      if (response.token && response.user) {
        localStorage.setItem('jwt', response.token);
        resetForm();
        onSubmit(response.user);
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleClose}
      title="Log In"
      onSubmit={handleSubmit}
      submitButtonText="Log In"
      loading={loading}
      error={error}
      footer={
        onSwitchToRegister ? (
          <p>
            Not a member yet?{' '}
            <button type="button" className="modal-switch-btn" onClick={onSwitchToRegister}>
              Sign up here
            </button>
          </p>
        ) : null
      }
    >
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
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

export default LoginModal;
