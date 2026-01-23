import axios from 'axios';

// Railway live backend URL
const API_URL = 'https://foodviz-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// --- Interceptor: Request mein Token bhejna ---
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Interceptor: Response Errors handle karna ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH FUNCTIONS ---
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

// --- PRODUCT FUNCTIONS ---
export const getProducts = async (filters?: { category?: string; search?: string; page?: number; limit?: number }) => {
  const params = filters || {};
  const response = await api.get('/admin/products', { params });
  return response.data;
};

export const createProduct = async (formData: FormData) => {
  const response = await api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

// --- CATEGORY FUNCTIONS ---
export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData: { name: string; description?: string }) => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

// --- AI 3D CONVERSION FUNCTIONS ---
/**
 * Ye function Railway backend ko signal bhejta hai 3D conversion start karne ke liye
 */
export const convertTo3D = async (productId: string, imageUrl: string) => {
  const response = await api.post('/admin/convert-3d', { productId, imageUrl });
  return response.data;
};

// --- ANALYTICS FUNCTIONS (For Dashboard) ---
export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export default api;