// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getColonies = () => API.get('/colonies');
export const createColony = (data) => API.post('/colonies', data);
export const deleteColony = (id) => API.delete(`/colonies/${id}`);
export const deleteAllColonies = () => API.delete('/colonies');
export const transferResources = (data) => API.post('/colonies/transfer', data);
