import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import { clothingAPI } from '../utils/api';
import './Main.css';

const Main = ({ currentUser, isLoggedIn, clothingItems, setClothingItems, onCardLike, onDeleteClothing }) => {
  const [clothing, setClothing] = useState(clothingItems || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClothing();
  }, []);

  useEffect(() => {
    setClothingItems(clothing);
  }, [clothing, setClothingItems]);

  const fetchClothing = async () => {
    try {
      const response = await clothingAPI.getClothing();
      const items = response.data?.clothing || response.clothing || [];
      setClothing(items);
    } catch (err) {
      setError('Failed to load clothing items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await onDeleteClothing(itemId);
      setClothing((items) => items.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
      throw err;
    }
  };

  if (loading) return <div className="main-container"><p className="loading">Loading...</p></div>;
  if (error) return <div className="main-container"><p className="error">{error}</p></div>;

  return (
    <main className="main-container">
      <h1>Today's Outfit</h1>
      {clothing.length === 0 ? (
        <p className="no-items">No clothing items available</p>
      ) : (
        <div className="clothing-grid">
          {clothing.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onCardLike={onCardLike}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
