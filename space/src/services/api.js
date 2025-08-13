import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Add /api here
});

export const getColonies = () => API.get('/colonies');
export const createColony = (colonyData) => API.post('/colonies', colonyData);
export const updateColony = (id, updates) => API.patch(`/colonies/${id}`, updates);

export default API;
