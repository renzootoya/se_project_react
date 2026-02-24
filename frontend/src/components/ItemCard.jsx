import React from 'react';
import './ItemCard.css';

const ItemCard = ({ item, onCardLike, isLoggedIn, currentUser }) => {
  const isLiked = item.likes && item.likes.some(id => id === currentUser?._id);

  const handleLike = () => {
    onCardLike({ id: item._id, isLiked });
  };

  return (
    <div className="item-card">
      <div className="item-image-container">
        <img src={item.imageUrl} alt={item.name} className="item-image" />
        {isLoggedIn && (
          <button 
            onClick={handleLike} 
            className={`like-button ${isLiked ? 'liked' : ''}`}
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
      </div>
    </div>
  );
};

export default ItemCard;
