import React, { useState } from 'react';
import './ItemCard.css';

const ItemCard = ({ item, onCardLike, isLoggedIn, currentUser, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLiked = item.likes && item.likes.some(id => id === currentUser?._id);
  const isOwner = currentUser?._id === item.owner;

  const handleLike = () => {
    if (!isLoggedIn) {
      alert('Please log in to like items');
      return;
    }
    onCardLike({ id: item._id, isLiked });
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      try {
        await onDelete(item._id);
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="item-card">
      <div className="item-image-container">
        <img src={item.imageUrl} alt={item.name} className="item-image" />
        {isLoggedIn && (
          <button 
            onClick={handleLike} 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        )}
        {isOwner && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-button"
            title="Delete item"
          >
            {isDeleting ? '...' : '🗑️'}
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
  );
};

export default ItemCard;
