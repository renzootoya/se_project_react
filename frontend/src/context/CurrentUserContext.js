import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = process.env.REACT_APP_API || 'http://localhost:3000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(response.data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, user) => {
    localStorage.setItem('token', token);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    API_URL
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};
