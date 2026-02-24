import React, { useState } from 'react';
import { signin } from '../utils/auth';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    
    try {
      const response = await signin(formData.email, formData.password);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      
      if (response.token) {
        localStorage.setItem('jwt', response.token);
      }
      
      onLogin(formData.email, formData.password);
      onClose();
      setFormData({ email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal_opened">
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form__title">Sign In</h2>
          
          {error && <p className="form__error">{error}</p>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form__input"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="form__input"
            required
          />
          
          <button type="submit" className="form__submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
