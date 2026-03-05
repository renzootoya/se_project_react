import React, { useState, useContext } from 'react';
import ItemModal from './ItemModal';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import './ItemCard.css';

const ItemCard = ({ item, isLoggedIn, currentUser, onCardLike, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { currentUser: contextUser } = useContext(CurrentUserContext);
  const user = currentUser || contextUser;

  const isLiked = item.likes && item.likes.some(id => id._id === user?._id || id === user?._id);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert('Please log in to like items');
      return;
    }

    setIsLiking(true);
    try {
      await onCardLike({ clothingId: item._id, isLiked });
    } catch (err) {
      console.error('Failed to like/unlike item:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (onDelete) {
      await onDelete(itemId);
    }
  };

  return (
    <>
      <div className="item-card" onClick={handleCardClick}>
        <div className="item-image-container">
          <img src={item.imageUrl} alt={item.name} className="item-image" />
          {isLoggedIn && (
            <button
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeClick}
              disabled={isLiking}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div className="item-info">
          <h3>{item.name}</h3>
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
