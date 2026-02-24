import React, { useState, useEffect } from 'react';
import { clothingAPI } from '../utils/api';
import './Home.css';

const Home = ({ currentUser, isLoggedIn, clothingItems, setClothingItems, onCardLike }) => {
  const [clothing, setClothing] = useState(clothingItems || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClothing();
  }, []);

  const fetchClothing = async () => {
    try {
      const response = await clothingAPI.getClothing();
      setClothing(response.data.clothing);
    } catch (err) {
      setError('Failed to load clothing items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (clothingId) => {
    if (!isLoggedIn) {
      alert('Please log in to like items');
      return;
    }

    try {
      await clothingAPI.likeClothing(clothingId);
      setClothing(clothing.map(item =>
        item._id === clothingId
          ? { ...item, liked: true }
          : item
      ));
    } catch (err) {
      console.error('Failed to like item:', err);
    }
  };

  const handleUnlike = async (clothingId) => {
    try {
      await clothingAPI.unlikeClothing(clothingId);
      setClothing(clothing.map(item =>
        item._id === clothingId
          ? { ...item, liked: false }
          : item
      ));
    } catch (err) {
      console.error('Failed to unlike item:', err);
    }
  };

  const isLiked = (clothingId) => {
    return currentUser?.likedClothes?.includes(clothingId);
  };

  if (loading) return <div className="home-container"><p>Loading...</p></div>;
  if (error) return <div className="home-container"><p className="error">{error}</p></div>;

  return (
    <div className="home-container">
      <h1>Today's Outfit</h1>
      <div className="clothing-grid">
        {clothing.map(item => (
          <div key={item._id} className="clothing-card">
            <img src={item.imageUrl} alt={item.name} className="clothing-image" />
            <div className="clothing-info">
              <h3>{item.name}</h3>
              <div className="clothing-weather">
                {item.weather.map(w => (
                  <span key={w} className="weather-tag">{w}</span>
                ))}
              </div>
              <button
                className={`like-btn ${isLiked(item._id) ? 'liked' : ''}`}
                onClick={() => isLiked(item._id) ? handleUnlike(item._id) : handleLike(item._id)}
              >
                {isLiked(item._id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
