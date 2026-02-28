import React, { useState } from 'react';
import './Modal.css';

const AddItemModal = ({ isOpen, onClose, onAddItem, isLoggedIn }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weather, setWeather] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const weatherOptions = ['Hot', 'Warm', 'Cool', 'Cold'];

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Item name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Item name must be at least 2 characters';
    }

    if (!imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(imageUrl)) {
      errors.imageUrl = 'Image URL must be a valid URL';
    }

    if (weather.length === 0) {
      errors.weather = 'Select at least one weather type';
    }

    return errors;
  };

  const handleWeatherToggle = (w) => {
    setWeather(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
    );
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
      await onAddItem({ name, imageUrl, weather });
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setImageUrl('');
    setWeather([]);
    setError('');
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  if (!isLoggedIn) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose}>×</button>
          <h2>Add Item</h2>
          <p className="login-required">Please log in to add items</p>
          <button onClick={handleClose} className="submit-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              disabled={loading}
            />
            {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              disabled={loading}
            />
            {validationErrors.imageUrl && <span className="field-error">{validationErrors.imageUrl}</span>}
          </div>

          {imageUrl && (
            <div className="avatar-preview">
              <img
                src={imageUrl}
                alt="Item Preview"
                className="preview-img"
                onError={(e) => {
                  e.target.alt = 'Invalid URL';
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label>Weather Types *</label>
            <div className="weather-options">
              {weatherOptions.map(w => (
                <label key={w} className="weather-checkbox">
                  <input
                    type="checkbox"
                    checked={weather.includes(w)}
                    onChange={() => handleWeatherToggle(w)}
                    disabled={loading}
                  />
                  {w}
                </label>
              ))}
            </div>
            {validationErrors.weather && <span className="field-error">{validationErrors.weather}</span>}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding...' : 'Add Item'}
            </button>
            <button type="button" onClick={handleClose} disabled={loading} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
