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
  const { setCurrentUser: setContextUser, setIsLoggedIn: setContextLoggedIn } = useContext(CurrentUserContext);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
        .then(response => {
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
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setContextLoggedIn(false);
        });
    }
  }, [setContextUser, setContextLoggedIn]);

  const handleRegister = async (name, avatar, email, password) => {
    try {
      const response = await auth.signup(name, avatar, email, password);
      if (response.token) {
        localStorage.setItem('jwt', response.token);
        setCurrentUser(response.user);
        setContextUser(response.user);
        setIsLoggedIn(true);
        setContextLoggedIn(true);
        setShowRegisterModal(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setContextLoggedIn(false);
    setCurrentUser({});
    setContextUser({});
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem('jwt');

    if (!isLiked) {
      api.clothingAPI.likeClothing(id)
        .then((response) => {
          setClothingItems((cards) =>
            cards.map((item) =>
              item._id === id ? { ...item, liked: true } : item
            )
          );
        })
        .catch((err) => console.log(err));
    } else {
      api.clothingAPI.unlikeClothing(id)
        .then((response) => {
          setClothingItems((cards) =>
            cards.map((item) =>
              item._id === id ? { ...item, liked: false } : item
            )
          );
        })
        .catch((err) => console.log(err));
    }
  };

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
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
          } 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile currentUser={currentUser} />
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
