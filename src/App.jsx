import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import AddItemModal from './components/AddItemModal';
import { checkToken, getItems, addCardLike, removeCardLike, createItem, deleteItem } from './utils/api';
import { fetchWeather } from './utils/weatherApi';

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
    fetchWeather().then(setWeatherData);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
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
        setClothingItems(data.data || []);
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
    return createItem(token, name, imageUrl, weather).then((response) => {
      if (response.data) {
        setClothingItems((items) => [response.data, ...items]);
        closeActiveModal();
      }
    });
  };

  const handleDeleteItem = (itemId) => {
    const token = localStorage.getItem('jwt');
    return deleteItem(token, itemId).then(() => {
      setClothingItems((items) => items.filter((item) => item._id !== itemId));
    });
  };

  const handleCardLike = (itemId, isLiked) => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    const endpoint = isLiked ? removeCardLike : addCardLike;
    return endpoint(token, itemId).then((response) => {
      if (response.data) {
        setClothingItems((items) =>
          items.map((item) => (item._id === itemId ? response.data : item))
        );
      }
    });
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
