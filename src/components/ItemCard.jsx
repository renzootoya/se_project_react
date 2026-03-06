import React, { useState, useContext } from 'react';
import ItemModal from './ItemModal';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import './ItemCard.css';

const ItemCard = ({ item, isLoggedIn, onCardLike, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);

  const isLiked = item.likes && item.likes.some(
    (id) => id._id === currentUser?._id || id === currentUser?._id
  );

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    setIsLiking(true);
    try {
      await onCardLike(item._id, isLiked);
    } catch (err) {
      console.error('Failed to like/unlike item:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (onDelete) await onDelete(itemId);
  };

  return (
    <>
      <div className="item-card" onClick={handleCardClick}>
        <div className="item-card__image-wrapper">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="item-card__image"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x300?text=No+Image';
            }}
          />
          {isLoggedIn && (
            <button
              className={`item-card__like-btn${isLiked ? ' item-card__like-btn_active' : ''}`}
              onClick={handleLikeClick}
              disabled={isLiking}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? '♥' : '♡'}
            </button>
          )}
        </div>
        <div className="item-card__info">
          <p className="item-card__name">{item.name}</p>
          {item.weather && item.weather.length > 0 && (
            <p className="item-card__weather">{item.weather[0]}</p>
          )}
        </div>
      </div>
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        onDelete={handleDelete}
        onLike={onCardLike}
      />
    </>
  );
};

export default ItemCard;
