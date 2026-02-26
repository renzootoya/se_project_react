import React from 'react';
import ItemCard from './ItemCard';
import './ClothesSection.css';

const ClothesSection = ({ clothingItems, onCardLike, isLoggedIn, currentUser, onDelete }) => {
  const userClothes = clothingItems.filter(item => 
    item.owner === currentUser?._id
  );

  if (userClothes.length === 0) {
    return (
      <section className="clothes-section">
        <h2>My Clothes</h2>
        <p className="empty-message">No clothing items yet. Add some to get started!</p>
      </section>
    );
  }

  return (
    <section className="clothes-section">
      <h2>My Clothes</h2>
      <div className="clothes-grid">
        {userClothes.map(item => (
          <ItemCard
            key={item._id}
            item={item}
            onCardLike={onCardLike}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default ClothesSection;
