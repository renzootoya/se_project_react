import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import ClothesSection from './ClothesSection';
import AddItemModal from './AddItemModal';
import EditProfileModal from './EditProfileModal';
import '../pages/Profile.css';

const Profile = ({ onUpdateProfile, onLogout, clothingItems, onCardLike, onDeleteItem, onAddItem }) => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    onLogout();
    navigate('/');
  };

  return (
    <div className="profile">
      <SideBar
        onEditProfile={() => setIsEditModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <div className="profile__clothes">
        <div className="profile__clothes-header">
          <p className="profile__clothes-title">Your items</p>
          <button className="profile__add-btn" onClick={() => setIsAddModalOpen(true)}>
            + Add new
          </button>
        </div>
        <ClothesSection
          clothingItems={clothingItems || []}
          onCardLike={onCardLike}
          isLoggedIn={true}
          onDelete={onDeleteItem}
        />
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={onAddItem}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
};

export default Profile;
