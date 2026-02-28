import React, { useState } from 'react';
import ItemModal from './ItemModal';
import './ItemCard.css';

const ItemCard = ({ item, onCardLike, isLoggedIn, currentUser, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLiked = item.likes && item.likes.some(id => id === currentUser?._id);
  const isOwner = currentUser?._id === item.owner;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleLike = async (likeData) => {
    if (!isLoggedIn) {
      alert('Please log in to like items');
      return;
    }
    await onCardLike(likeData);
  };

  const handleDelete = async (itemId) => {
    await onDelete(itemId);
  };

  return (
    <>
      <div className="item-card" onClick={handleCardClick}>
        <div className="item-image-container">
          <img src={item.imageUrl} alt={item.name} className="item-image" />
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
        currentUser={currentUser}
        onDelete={handleDelete}
        onLike={handleLike}
      />
    </>
  );
};

export default ItemCard;
