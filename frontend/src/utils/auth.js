const API_BASE_URL = process.env.REACT_APP_API || 'http://localhost:3000/api';

export const signup = (name, avatar, email, password) => {
  return fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, avatar, email, password })
  }).then(response => response.json());
};

export const signin = (email, password) => {
  return fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(response => response.json());
};

export const checkToken = (token) => {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(response => response.json());
};
