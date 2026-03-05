import React, { useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ModalWithForm from '../hooks/ModalWithForm';

const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weather, setWeather] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(CurrentUserContext);

  const weatherOptions = ['Hot', 'Warm', 'Cool', 'Cold'];

  const handleWeatherToggle = (w) => {
    setWeather(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !imageUrl.trim() || weather.length === 0) {
      setError('Please fill in all required fields');
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isLoggedIn && isOpen) {
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
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Item"
      onSubmit={handleSubmit}
      submitButtonText="Add Item"
      loading={loading}
      error={error}
    >
      <div className="form-group">
        <label>Item Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          disabled={loading}
        />
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
      </div>
    </ModalWithForm>
  );
};

export default AddItemModal;
