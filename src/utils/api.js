import axios from 'axios';

const API_URL = process.env.REACT_APP_API || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('jwt');

export const apiCall = axios.create({
  baseURL: API_URL
});

apiCall.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password) =>
    apiCall.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    apiCall.post('/auth/login', { email, password }),
  getCurrentUser: () =>
    apiCall.get('/auth/me'),
  updateProfile: (name, avatar) =>
    apiCall.patch('/auth/me', { name, avatar })
};

export const clothingAPI = {
  getClothing: () =>
    apiCall.get('/clothing'),
  createClothing: (name, imageUrl, weather) =>
    apiCall.post('/clothing', { name, imageUrl, weather }),
  likeClothing: (clothingId) =>
    apiCall.post('/clothing/like', { clothingId }),
  unlikeClothing: (clothingId) =>
    apiCall.post('/clothing/unlike', { clothingId }),
  addCardLike: (id, token) =>
    fetch(`${API_URL}/cards/${id}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
  removeCardLike: (id, token) =>
    fetch(`${API_URL}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
  deleteCard: (id, token) =>
    fetch(`${API_URL}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    }).then(res => res.json())
};

export const userAPI = {
  updateUser: (name, avatar, token) =>
    fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, avatar })
    }).then(res => res.json())
};
