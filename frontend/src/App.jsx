import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import Header from './components/Header';
import Main from './components/Main';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import { checkToken, signup, signin, getItems } from './utils/api';

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

  const handleRegister = (name, avatar, email, password) => {
    signup(name, avatar, email, password)
      .then((data) => {
        if (data.token && data.user) {
          localStorage.setItem('jwt', data.token);
          setCurrentUser(data.user);
          setIsLoggedIn(true);
          setActiveModal(null);
        } else {
          alert(data.message || 'Registration failed');
        }
      })
      .catch((err) => {
        console.error('Registration error:', err);
        alert('Registration failed');
      });
  };

  const handleLogin = (email, password) => {
    signin(email, password)
      .then((data) => {
        if (data.token && data.user) {
          localStorage.setItem('jwt', data.token);
          setCurrentUser(data.user);
          setIsLoggedIn(true);
          setActiveModal(null);
        } else {
          alert(data.message || 'Login failed');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Login failed');
      });
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
      
      const data = await endpoint(token, itemId);
      
      const updatedItems = clothingItems.map(item => {
        if (item._id === itemId) {
          return { ...item, likes: data.data?.likes || item.likes };
        }
        return item;
      });
      setClothingItems(updatedItems);
    } catch (err) {
      console.error('Error updating like:', err);
      alert('Failed to update like status');
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
                  currentUser={currentUser}
                  onCardLike={handleCardLike}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <div style={{ flex: 1, padding: '40px 20px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                      <h1>My Profile</h1>
                      {currentUser && (
                        <div style={{ marginTop: '30px' }}>
                          {currentUser.avatar && (
                            <img 
                              src={currentUser.avatar} 
                              alt={currentUser.name}
                              style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }}
                            />
                          )}
                          <p><strong>Name:</strong> {currentUser.name}</p>
                          <p><strong>Email:</strong> {currentUser.email}</p>
                          <button 
                            onClick={handleLogout}
                            style={{
                              marginTop: '20px',
                              padding: '10px 20px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>

        {activeModal === 'register' && <RegisterModal onClose={() => setActiveModal(null)} onSubmit={handleRegister} />}
        {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} onSubmit={handleLogin} />}
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}

export default App;
