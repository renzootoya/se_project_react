import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AddItemModal from './components/AddItemModal';
import EditProfileModal from './components/EditProfileModal';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import { authAPI, clothingAPI } from './utils/api';
import { checkToken } from './utils/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
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

  const handleRegister = async (name, avatar, email, password) => {
    try {
      const response = await authAPI.register(name, avatar, email, password);
      if (response.data?.user) {
        setCurrentUser(response.data.user);
        setIsLoggedIn(true);
        setShowRegisterModal(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data?.user) {
        setCurrentUser(response.data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleAddItem = async (itemData) => {
    try {
      const response = await clothingAPI.createClothing(
        itemData.name,
        itemData.imageUrl,
        itemData.weather
      );
      if (response.data) {
        setClothingItems([...clothingItems, response.data]);
        setShowAddItemModal(false);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const handleCardLike = async (likeData) => {
    try {
      if (likeData.isLiked) {
        await clothingAPI.unlikeClothing(likeData.clothingId);
      } else {
        await clothingAPI.likeClothing(likeData.clothingId);
      }

      const updatedItems = clothingItems.map(item => {
        if (item._id === likeData.clothingId) {
          if (likeData.isLiked) {
            return {
              ...item,
              likes: item.likes.filter(id => id !== currentUser._id)
            };
          } else {
            return {
              ...item,
              likes: [...(item.likes || []), currentUser._id]
            };
          }
        }
        return item;
      });
      setClothingItems(updatedItems);
    } catch (error) {
      console.error('Failed to like/unlike item:', error);
      throw error;
    }
  };

  const handleDeleteClothing = async (itemId) => {
    try {
      await clothingAPI.deleteClothing(itemId);
      setClothingItems(clothingItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn }}>
      <Router>
        <div className="app">
          <Header
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
            onShowRegister={() => setShowRegisterModal(true)}
            onShowLogin={() => setShowLoginModal(true)}
            onShowAddItem={() => setShowAddItemModal(true)}
            showRegisterModal={showRegisterModal}
            setShowRegisterModal={setShowRegisterModal}
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            onRegister={handleRegister}
            onLogin={handleLogin}
            onToggleSidebar={() => {}}
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
                  onDeleteClothing={handleDeleteClothing}
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
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn}
                    onDeleteClothing={handleDeleteClothing}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />

          <AddItemModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onAddItem={handleAddItem}
          />

          <EditProfileModal
            isOpen={showEditProfileModal}
            onClose={() => setShowEditProfileModal(false)}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        </div>
      </Router>
    </CurrentUserContext.Provider>
  );
}

export default App;

