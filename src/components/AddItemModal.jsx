import React, { useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ModalWithForm from './ModalWithForm';

// "Cool" does not exist per the project task — only Hot, Warm, Cold
const WEATHER_OPTIONS = ['Hot', 'Warm', 'Cold'];

const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(CurrentUserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !imageUrl.trim() || !weather) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // weather is stored as an array for backend compatibility
      await onAddItem({ name, imageUrl, weather: [weather] });
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
    setWeather('');
    setError('');
  };

  const handleClose = () => { resetForm(); onClose(); };

  if (!isLoggedIn && isOpen) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose} type="button">×</button>
          <h2 className="modal-title">Add Garment</h2>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '16px' }}>
            Please log in to add items
          </p>
          <button onClick={handleClose} className="modal-submit-btn" style={{ marginTop: '24px' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleClose}
      title="New garment"
      onSubmit={handleSubmit}
      submitButtonText="Add garment"
      loading={loading}
      error={error}
    >
      <div className="form-group">
        <label htmlFor="item-name">Name</label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="item-image">Image URL</label>
        <input
          id="item-image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          disabled={loading}
          required
        />
      </div>

      {imageUrl && (
        <div className="avatar-preview">
          <img
            src={imageUrl}
            alt="Preview"
            className="preview-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="form-group">
        <label>Select the weather type:</label>
        <div className="weather-options">
          {WEATHER_OPTIONS.map((w) => (
            <label key={w} htmlFor={`weather-${w.toLowerCase()}`} className="weather-radio">
              <input
                id={`weather-${w.toLowerCase()}`}
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={(e) => setWeather(e.target.value)}
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
