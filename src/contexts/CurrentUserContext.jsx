import React, { createContext, useState, useCallback } from 'react';

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = useCallback((user) => {
    setCurrentUser(user);
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
  }, []);

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    error,
    setCurrentUser,
    setIsLoggedIn,
    setLoading,
    setError,
    updateUser,
    logout
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};
