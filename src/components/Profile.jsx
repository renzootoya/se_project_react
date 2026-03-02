import React from 'react';
import SideBar from './SideBar';
import ClothesSection from './ClothesSection';

export default function Profile({ currentUser, clothingItems, onCardLike, isLoggedIn }) {
  return (
    <div className="profile">
      <SideBar />
      <ClothesSection 
        clothingItems={clothingItems}
        onCardLike={onCardLike}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
    </div>
  );
}
