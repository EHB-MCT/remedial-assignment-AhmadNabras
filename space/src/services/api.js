import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getColonies = () => API.get('/colonies');
export const createColony = (colonyData) => API.post('/colonies', colonyData);
export const deleteColony = (id) => API.delete(`/colonies/${id}`); // ✅ Added

export default API;
