import React, { useState } from 'react';
import { signin } from '../utils/api';
import ModalWithForm from '../hooks/ModalWithForm';

const LoginModal = ({ onClose, onSubmit, isOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await signin(email, password);
      console.log('Signin response:', response);

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
        setError('Login failed - invalid response');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const resetForm = () => {
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
      title="Log In"
      onSubmit={handleSubmit}
      submitButtonText="Log In"
      loading={loading}
      error={error}
    >
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
    </ModalWithForm>
  );
};

export default LoginModal;
