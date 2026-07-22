import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
};

export const vehicleAPI = {
  getAll: () => api.get('/api/vehicles'),
  search: (params) => api.get('/api/vehicles/search', { params }),
  smartSearch: (query) => api.get('/api/vehicles/smart-search', { params: { query } }),
  getRecommendations: (id, limit = 3) => api.get(`/api/vehicles/${id}/recommendations`, { params: { limit } }),
  getById: (id) => api.get(`/api/vehicles/${id}`),
  create: (vehicleData) => api.post('/api/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/api/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/api/vehicles/${id}`),
  purchase: (id) => api.post(`/api/vehicles/${id}/purchase`),
  restock: (id, quantity) => api.post(`/api/vehicles/${id}/restock`, { quantity }),
};

export default api;
