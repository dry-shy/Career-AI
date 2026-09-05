import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60s for AI calls
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careerai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careerai_token');
      localStorage.removeItem('careerai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
