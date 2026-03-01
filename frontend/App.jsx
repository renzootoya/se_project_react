import './src/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './src/components/Header';
import Main from './src/components/Main';
import Footer from './src/components/Footer';
import Profile from './src/pages/Profile';
import ProtectedRoute from './src/components/ProtectedRoute';
import { CurrentUserContext } from './src/contexts/CurrentUserContext';
import { checkToken } from './src/utils/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await checkToken(token);
      if (response.user) {
        setCurrentUser(response.user);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('jwt');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowRegisterModal(false);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleCardLike = async (likeData) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        alert('Please log in to like items');
        return;
      }

      const endpoint = likeData.isLiked ? 'unlike' : 'like';
      const response = await fetch(
        `${process.env.REACT_APP_API || 'http://localhost:3000/api'}/clothing/${likeData.clothingId}/${endpoint}`,
        {
          method: likeData.isLiked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const data = await response.json();

      const updatedItems = clothingItems.map(item => {
        if (item._id === likeData.clothingId) {
          return {
            ...item,
            likes: data.data?.likes || item.likes
          };
        }
        return item;
      });
      setClothingItems(updatedItems);
    } catch (err) {
      console.error('Failed to like/unlike item:', err);
      alert('Failed to update like status');
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn, setCurrentUser }}>
      <Router>
        <div className="app">
          <Header
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
            onShowRegister={() => setShowRegisterModal(true)}
            onShowLogin={() => setShowLoginModal(true)}
            showRegisterModal={showRegisterModal}
            setShowRegisterModal={setShowRegisterModal}
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            onRegister={handleRegister}
            onLogin={handleLogin}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  currentUser={currentUser}
                  isLoggedIn={isLoggedIn}
                  clothingItems={clothingItems}
                  setClothingItems={setClothingItems}
                  onCardLike={handleCardLike}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    currentUser={currentUser}
                    onUpdateProfile={handleUpdateProfile}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </CurrentUserContext.Provider>
  );
}

export default App;
