import React, { useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { deleteItem } from '../utils/api';
import './ItemModal.css';
import './Modal.css';

const ItemModal = ({ isOpen, onClose, item, onDelete, onLike }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useContext(CurrentUserContext);

  if (!isOpen || !item) return null;

  const isOwner = currentUser && (currentUser._id === item.owner?._id || currentUser._id === item.owner);
  const isLiked = item.likes && item.likes.some(id => id._id === currentUser?._id || id === currentUser?._id);

  const handleDelete = async () => {
    if (!isOwner || !item) return;

    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          setError('No authentication token found');
          setIsDeleting(false);
          return;
        }
        await deleteItem(token, item._id);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to delete item');
        setIsDeleting(false);
      }
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      setError('Please log in to like items');
      return;
    }

    setIsLiking(true);
    setError('');
    try {
      await onLike({ clothingId: item._id, isLiked });
    } catch (err) {
      setError(err.message || 'Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="item-modal-content">
          <img src={item.imageUrl} alt={item.name} className="modal-item-image" />
          <div className="modal-item-info">
            <h2>{item.name}</h2>
            {item.weather && (
              <div className="weather-tags">
                {item.weather.map(w => (
                  <span key={w} className="weather-tag">{w}</span>
                ))}
              </div>
            )}
            {item.likes && (
              <div className="likes-count">
                {item.likes.length} {item.likes.length === 1 ? 'like' : 'likes'}
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              {currentUser && (
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`like-btn ${isLiked ? 'liked' : ''}`}
                >
                  {isLiking ? 'Loading...' : (isLiked ? '❤️ Unlike' : '🤍 Like')}
                </button>
              )}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="delete-btn"
                >
                  {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              )}
              <button onClick={onClose} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
