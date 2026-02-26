import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children, loading = false }) => {
  if (loading) {
    return <div className="protected-route-loading">Loading...</div>;
  }
  
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
