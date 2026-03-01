const API_BASE_URL = process.env.REACT_APP_API || 'http://localhost:3000/api';

export const signup = (name, avatar, email, password) => {
  return fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, avatar, email, password })
  }).then(res => res.json());
};

export const signin = (email, password) => {
  return fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
};

export const checkToken = (token) => {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
};

export const updateUser = (token, name, avatar) => {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, avatar })
  }).then(res => res.json());
};

export const getItems = () => {
  return fetch(`${API_BASE_URL}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
};

export const addCardLike = (token, itemId) => {
  return fetch(`${API_BASE_URL}/items/${itemId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
};

export const removeCardLike = (token, itemId) => {
  return fetch(`${API_BASE_URL}/items/${itemId}/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
};

export const deleteItem = (token, itemId) => {
  return fetch(`${API_BASE_URL}/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
};

export const createItem = (token, name, imageUrl, weather) => {
  return fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, imageUrl, weather })
  }).then(res => res.json());
};
