import React, { useState, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { deleteItem } from '../utils/api';
import './ItemModal.css';

const ItemModal = ({ isOpen, onClose, item, onDelete, onLike }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);

  if (!isOpen || !item) return null;

  const isOwner =
    currentUser &&
    (currentUser._id === item.owner?._id || currentUser._id === item.owner);

  const isLiked =
    item.likes &&
    item.likes.some(
      (id) => id._id === currentUser?._id || id === currentUser?._id
    );

  const handleDelete = async () => {
    if (!isOwner || !item) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('jwt');
      await deleteItem(token, item._id);
      if (onDelete) onDelete(item._id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    setIsLiking(true);
    try {
      await onLike(item._id, isLiked);
    } catch (err) {
      console.error('Like failed:', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="item-modal__overlay" onClick={onClose}>
      <div className="item-modal__card" onClick={(e) => e.stopPropagation()}>
        {/* Header: name + close button */}
        <div className="item-modal__header">
          <h2 className="item-modal__name">{item.name}</h2>
          <button className="item-modal__close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {/* Image */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="item-modal__image"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />

        {/* Info row */}
        <div className="item-modal__info">
          <div className="item-modal__meta">
            <span className="item-modal__weather-label">Weather:</span>
            {item.weather && item.weather.map((w) => (
              <span key={w} className="item-modal__weather-tag">{w}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="item-modal__actions">
            {isOwner && (
              <button
                className="item-modal__delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? 'Deleting…' : 'Delete item'}
              </button>
            )}
            {currentUser && (
              <button
                className={`item-modal__like-btn${isLiked ? ' item-modal__like-btn_active' : ''}`}
                onClick={handleLike}
                disabled={isLiking}
                type="button"
              >
                {isLiked ? '❤️ Unlike' : '🤍 Like'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
