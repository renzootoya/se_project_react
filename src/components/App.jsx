import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../App.css';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import AddItemModal from './AddItemModal';
import { checkToken } from '../utils/auth';
import { getItems, addCardLike, removeCardLike, createItem, deleteItem } from '../utils/api';
import { fetchWeather } from '../utils/weatherApi';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);

  const closeActiveModal = () => setActiveModal(null);

  useEffect(() => {
    fetchWeather()
      .then(setWeatherData)
      .catch((err) => console.error('Weather fetch error:', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((data) => {
          const user = data.user || data;
          if (user._id) {
            setCurrentUser(user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch(() => {
          localStorage.removeItem('jwt');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    getItems()
      .then((data) => {
        setClothingItems(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => console.error('Error loading items:', err));
  }, []);

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    closeActiveModal();
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    closeActiveModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleAddItem = ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem('jwt');
    return createItem(token, name, imageUrl, weather)
      .then((response) => {
        const item = response.data || response;
        if (item._id) {
          setClothingItems((items) => [item, ...items]);
          closeActiveModal();
        }
      })
      .catch((err) => console.error('Add item error:', err));
  };

  const handleDeleteItem = (itemId) => {
    const token = localStorage.getItem('jwt');
    return deleteItem(token, itemId)
      .then(() => {
        setClothingItems((items) => items.filter((item) => item._id !== itemId));
      })
      .catch((err) => console.error('Delete item error:', err));
  };

  const handleCardLike = (itemId, isLiked) => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    const endpoint = isLiked ? removeCardLike : addCardLike;
    return endpoint(token, itemId)
      .then((response) => {
        const updated = response.data || response;
        if (updated._id) {
          setClothingItems((items) =>
            items.map((item) => (item._id === itemId ? updated : item))
          );
        }
      })
      .catch((err) => console.error('Like error:', err));
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn, setCurrentUser }}>
      <BrowserRouter>
        <div className="page">
          <Header
            onSignUp={() => setActiveModal('register')}
            onSignIn={() => setActiveModal('login')}
            onLogout={handleLogout}
            onAddClothes={() => setActiveModal('add-item')}
            isCelsius={isCelsius}
            onToggleTemp={() => setIsCelsius((prev) => !prev)}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  clothingItems={clothingItems}
                  isLoggedIn={isLoggedIn}
                  onCardLike={handleCardLike}
                  weatherData={weatherData}
                  isCelsius={isCelsius}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    onUpdateProfile={handleUpdateProfile}
                    onLogout={handleLogout}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                    onDeleteItem={handleDeleteItem}
                    onAddItem={handleAddItem}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>

        {activeModal === 'register' && (
          <RegisterModal
            isOpen
            onClose={closeActiveModal}
            onSubmit={handleRegister}
            onSwitchToLogin={() => setActiveModal('login')}
          />
        )}
        {activeModal === 'login' && (
          <LoginModal
            isOpen
            onClose={closeActiveModal}
            onSubmit={handleLogin}
            onSwitchToRegister={() => setActiveModal('register')}
          />
        )}
        {activeModal === 'add-item' && (
          <AddItemModal
            isOpen
            onClose={closeActiveModal}
            onAddItem={handleAddItem}
          />
        )}
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
