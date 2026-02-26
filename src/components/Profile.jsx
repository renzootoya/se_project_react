import React, { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';
import SideBar from './SideBar';
import ClothesSection from './ClothesSection';

export default function Profile() {
  const { currentUser, isLoggedIn } = useContext(CurrentUserContext);

  if (!isLoggedIn) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="profile">
      <SideBar currentUser={currentUser} />
      <ClothesSection currentUser={currentUser} />
    </div>
  );
}
