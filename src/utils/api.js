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
  register: (name, avatar, email, password) =>
    apiCall.post('/auth/register', { name, avatar, email, password }),
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
  deleteClothing: (clothingId) =>
    apiCall.delete(`/clothing/${clothingId}`)
};
