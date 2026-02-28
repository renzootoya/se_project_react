import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrentUserProvider, CurrentUserContext } from '../contexts/CurrentUserContext';
import './App.css';
import Header from './Header.jsx';
import Main from './Main';
import Footer from './Footer';
import SideBar from './SideBar';
import Profile from '../pages/Profile.jsx';
import ProtectedRoute from './ProtectedRoute';
import AddItemModal from './AddItemModal';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import * as auth from '../utils/auth';
import * as api from '../utils/api';

function AppContent() {
  const {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    setLoading: setContextLoading,
    setError: setContextError
  } = useContext(CurrentUserContext);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsInitializing(true);
      const token = localStorage.getItem('jwt');

      if (token) {
        try {
          const response = await auth.checkToken(token);
          if (response.user) {
            setCurrentUser(response.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('jwt');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [setCurrentUser, setIsLoggedIn]);

  const handleRegister = async (name, avatar, email, password) => {
    try {
      const response = await auth.signup(name, avatar, email, password);
      if (response.token) {
        localStorage.setItem('jwt', response.token);
        const userResponse = await auth.checkToken(response.token);
        if (userResponse.user) {
          setCurrentUser(userResponse.user);
          setIsLoggedIn(true);
          setShowRegisterModal(false);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await auth.signin(email, password);
      if (response.token) {
        localStorage.setItem('jwt', response.token);
        const userResponse = await auth.checkToken(response.token);
        if (userResponse.user) {
          setCurrentUser(userResponse.user);
          setIsLoggedIn(true);
          setShowLoginModal(false);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleCardLike = async ({ id, isLiked }) => {
    try {
      if (!isLiked) {
        await api.clothingAPI.likeClothing(id);
        setClothingItems((items) =>
          items.map((item) =>
            item._id === id
              ? { ...item, likes: [...(item.likes || []), currentUser._id] }
              : item
          )
        );
      } else {
        await api.clothingAPI.unlikeClothing(id);
        setClothingItems((items) =>
          items.map((item) =>
            item._id === id
              ? { ...item, likes: (item.likes || []).filter(uid => uid !== currentUser._id) }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update like status:', err);
    }
  };

  const handleDeleteClothing = async (id) => {
    try {
      await api.clothingAPI.deleteClothing(id);
      setClothingItems((items) => items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete clothing:', err);
      throw err;
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const response = await api.clothingAPI.createClothing(
        itemData.name,
        itemData.imageUrl,
        itemData.weather
      );
      const newItem = response.data?.data || response.data;
      setClothingItems((items) => [...items, newItem]);
      setShowAddItemModal(false);
    } catch (err) {
      console.error('Failed to add item:', err);
      throw err;
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (isInitializing) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
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
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Routes>
        <Route
          path="/"
          element={
            <Main
              clothingItems={clothingItems}
              setClothingItems={setClothingItems}
              onCardLike={handleCardLike}
              onDeleteClothing={handleDeleteClothing}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
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

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAddItem={handleAddItem}
        isLoggedIn={isLoggedIn}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <Footer />
    </Router>
  );
}

function App() {
  return (
    <CurrentUserProvider>
      <AppContent />
    </CurrentUserProvider>
  );
}

export default App;
