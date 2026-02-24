import React, { useState } from 'react';
import { signup } from '../utils/auth';
import './RegisterModal.css';

export default function RegisterModal({ isOpen, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
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
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      setLoading(false);
      return;
    }
    
    try {
      const response = await signup(formData.name, formData.avatar, formData.email, formData.password);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }
      
      if (response.token) {
        localStorage.setItem('jwt', response.token);
      }
      
      onRegister(formData.name, formData.avatar, formData.email, formData.password);
      onClose();
      setFormData({ name: '', avatar: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h2 className="form__title">Sign Up</h2>
          
          {error && <p className="form__error">{error}</p>}
          
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="form__input"
            required
          />
          
          <input
            type="url"
            name="avatar"
            placeholder="Avatar URL"
            value={formData.avatar}
            onChange={handleChange}
            className="form__input"
            required
          />
          
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
          
          <button type="submit" className="form__submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
