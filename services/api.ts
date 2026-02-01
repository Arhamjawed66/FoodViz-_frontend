import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const login = async (username:any, password:any) => {
  // Yahan full URL ke bajaye API_BASE_URL use karein
  const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProducts = async (filters?: { category?: string; search?: string; page?: number; limit?: number }) => {
  const params = filters || {};
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

export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData: { name: string; description?: string }) => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/admin/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id: string, categoryData: { name?: string; description?: string }) => {
  const response = await api.put(`/admin/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export const convertTo3D = async (productId: string, imageUrl: string) => {
  const response = await api.post('/admin/convert-3d', { productId, imageUrl });
  return response.data;
};

export default api;
