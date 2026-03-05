import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import WeatherCard from './WeatherCard';
import { getItems } from '../utils/api';
import './Main.css';

const Main = ({ isLoggedIn, clothingItems, setClothingItems, onCardLike }) => {
  const [loading, setLoading] = useState(true);

  const fetchClothing = async () => {
    try {
      const data = await getItems();
      setClothingItems(data.data || []);
    } catch (err) {
      console.error('Failed to load clothing items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClothing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="main-container"><p>Loading...</p></div>;

  return (
    <main className="main-container">
      <h1>Today's Outfit</h1>
      
      <WeatherCard />
      
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
              onCardLike={onCardLike}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
