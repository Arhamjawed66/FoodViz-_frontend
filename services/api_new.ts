import axios from 'axios';

const API_URL = 'https://foodviz-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProducts = async (category?: string) => {
  const params = category ? { category } : {};
  const response = await api.get('/admin/products', { params });
  return response.data;
};

export const createProduct = async (formData: FormData) => {
    const response = await api.post('/admin/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (userData: { username: string; email: string }) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

export default api;
