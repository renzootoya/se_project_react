import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import WeatherCard from './WeatherCard';
import { getItems } from '../utils/api';
import './Main.css';

const Main = ({ isLoggedIn, clothingItems, setClothingItems, onCardLike }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data.data || []);
      })
      .catch((err) => {
        console.error('Failed to load clothing items:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="main"><p className="main__loading">Loading...</p></div>;

  return (
    <main className="main">
      <WeatherCard />
      <section className="main__clothes">
        {clothingItems.length === 0 ? (
          <p className="main__empty">No clothing items available</p>
        ) : (
          <div className="main__cards">
            {clothingItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isLoggedIn={isLoggedIn}
                onCardLike={onCardLike}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Main;
