import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import './Main.css';

const Main = ({ currentUser, isLoggedIn, clothingItems, setClothingItems, onCardLike }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClothing();
  }, []);

  const fetchClothing = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API || 'http://localhost:3000/api'}/clothing`);
      const data = await response.json();
      setClothingItems(data.data || []);
    } catch (err) {
      console.error('Failed to load clothing items:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-container"><p>Loading...</p></div>;

  return (
    <main className="main-container">
      <h1>Today's Outfit</h1>
      
      <section className="weather-section">
        <h2>Weather Guide</h2>
        <div className="weather-grid">
          {['Hot', 'Warm', 'Cool', 'Cold'].map(weather => (
            <div key={weather} className="weather-card">
              <div className="weather-icon">
                {weather === 'Hot' && '☀️'}
                {weather === 'Warm' && '🌤️'}
                {weather === 'Cool' && '🌥️'}
                {weather === 'Cold' && '❄️'}
              </div>
              <h3>{weather}</h3>
            </div>
          ))}
        </div>
      </section>

      {clothingItems.length === 0 ? (
        <p className="no-items">No clothing items available</p>
      ) : (
        <div className="clothing-grid">
          {clothingItems.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onCardLike={onCardLike}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
