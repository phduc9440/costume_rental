import axios from 'axios';
import { getToken } from '../utils/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080', // Fallback to localhost if env is missing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to requests automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
