import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrentUserProvider, CurrentUserContext } from './contexts/CurrentUserContext';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './utils/ProtectedRoute';
import * as auth from './utils/auth';
import * as api from './utils/api';
import './App.css';

function AppContent() {
  const { 
    setCurrentUser: setContextUser, 
    setIsLoggedIn: setContextLoggedIn,
    setLoading: setContextLoading,
    setError: setContextError
  } = useContext(CurrentUserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
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
            setContextUser(response.user);
            setIsLoggedIn(true);
            setContextLoggedIn(true);
          } else {
            localStorage.removeItem('jwt');
            setIsLoggedIn(false);
            setContextLoggedIn(false);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setContextLoggedIn(false);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [setContextUser, setContextLoggedIn]);

  const handleRegister = async (name, avatar, email, password) => {
    try {
      const response = await auth.signup(name, avatar, email, password);
      if (response.token) {
        localStorage.setItem('jwt', response.token);
        const userResponse = await auth.checkToken(response.token);
        if (userResponse.user) {
          setCurrentUser(userResponse.user);
          setContextUser(userResponse.user);
          setIsLoggedIn(true);
          setContextLoggedIn(true);
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
          setContextUser(userResponse.user);
          setIsLoggedIn(true);
          setContextLoggedIn(true);
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
    setContextLoggedIn(false);
    setCurrentUser(null);
    setContextUser(null);
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
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('No authentication token');
      
      await api.clothingAPI.deleteCard(id, token);
      setClothingItems((items) => items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete clothing:', err);
      throw err;
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    setContextUser(updatedUser);
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
            <Home 
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
              />
            </ProtectedRoute>
          }
        />
      </Routes>
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
