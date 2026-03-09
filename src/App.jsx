import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import Header from './components/Header';
import Main from './components/Main';
import AddItemModal from './components/AddItemModal';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import { checkToken, getItems, createItem } from './utils/api';
import { fetchWeather } from './utils/weatherApi';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);

  // ── Close any open modal ──────────────────────────────────
  const closeActiveModal = () => setActiveModal(null);

  // ── Fetch weather on mount ────────────────────────────────
  useEffect(() => {
    fetchWeather().then(setWeatherData);
  }, []);

  // ── Verify token and load items on mount ──────────────────
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
        .catch(() => localStorage.removeItem('jwt'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    getItems()
      .then((data) => setClothingItems(data.data || []))
      .catch((err) => console.error('Error loading items:', err));
  }, []);

  // ── Auth handlers ─────────────────────────────────────────
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

  const handleUpdateProfile = (updatedUser) => setCurrentUser(updatedUser);

  // ── Item handlers ─────────────────────────────────────────
  const handleAddItem = async ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem('jwt');
    const response = await createItem(token, name, imageUrl, weather);
    const newItem = response.data || response;
    setClothingItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteItem = (itemId) => {
    setClothingItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const handleCardLike = async (itemId, isLiked) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      const { addCardLike, removeCardLike } = await import('./utils/api');
      const fn = isLiked ? removeCardLike : addCardLike;
      const response = await fn(token, itemId);
      const updatedLikes = response.data?.likes || response.likes;
      setClothingItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, likes: updatedLikes || item.likes }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  if (loading) return <div className="app-loading">Loading…</div>;

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
        </div>

        {/* ── Modals ── */}
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
