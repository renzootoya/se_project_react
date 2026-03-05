import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import Header from './components/Header';
import Main from './components/Main';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import { checkToken, getItems } from './utils/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setActiveModal(null);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleCardLike = async (itemId, isLiked) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        alert('Please log in to like items');
        return;
      }

      const { addCardLike, removeCardLike } = await import('./utils/api');
      const endpoint = isLiked ? removeCardLike : addCardLike;
      
      const response = await endpoint(token, itemId);
      
      const updatedItems = clothingItems.map(item => {
        if (item._id === itemId) {
          return { ...item, likes: response.data?.likes || response.likes || item.likes };
        }
        return item;
      });
      setClothingItems(updatedItems);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoggedIn, setCurrentUser }}>
      <BrowserRouter>
        <div className="page">
          <Header 
            isLoggedIn={isLoggedIn} 
            currentUser={currentUser}
            onSignUp={() => setActiveModal('register')}
            onSignIn={() => setActiveModal('login')}
            onLogout={handleLogout}
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <Main 
                  clothingItems={clothingItems} 
                  setClothingItems={setClothingItems}
                  isLoggedIn={isLoggedIn}
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
        </div>

        {activeModal === 'register' && <RegisterModal isOpen={true} onClose={() => setActiveModal(null)} onSubmit={handleRegister} />}
        {activeModal === 'login' && <LoginModal isOpen={true} onClose={() => setActiveModal(null)} onSubmit={handleLogin} />}
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
