// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Colonies API calls
export const getColonies = () => API.get('/colonies');
export const createColony = (colonyData) => API.post('/colonies', colonyData);
export const updateColony = (id, updates) => API.patch(`/colonies/${id}`, updates);

export default API;
