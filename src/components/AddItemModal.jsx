import React, { useState } from 'react';
import ModalWithForm from './ModalWithForm';

const WEATHER_OPTIONS = ['Hot', 'Warm', 'Cold'];

const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !imageUrl.trim() || !weather) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    onAddItem({ name, imageUrl, weather: [weather] })
      .then(() => {
        resetForm();
      })
      .catch((err) => {
        setError(err.message || 'Failed to add item');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setName('');
    setImageUrl('');
    setWeather('');
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
      title="New Garment"
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
        <label htmlFor="item-image">Image</label>
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

      <div className="form-group">
        <p className="form-group__label">Select the weather type:</p>
        {WEATHER_OPTIONS.map((w) => (
          <label
            key={w}
            htmlFor={`weather-${w.toLowerCase()}`}
            className="weather-radio"
          >
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
    </ModalWithForm>
  );
};

export default AddItemModal;
