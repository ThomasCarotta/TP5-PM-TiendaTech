// services/api.js
import axios from 'axios';

const API_URL = 'http://10.0.2.2:1337/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios para productos
export const productService = {
  getProducts: () => api.get('/products?populate=*'),
  getProduct: (id) => api.get(`/products/${id}?populate=*`),
  getCategories: () => api.get('/categories?populate=*'),
  getBrands: () => api.get('/brands?populate=*'),
  
  // Para filtros (futuro)
  getProductsByCategory: (categoryId) => 
    api.get(`/products?filters[category][id][$eq]=${categoryId}&populate=*`),
  getProductsByBrand: (brandId) => 
    api.get(`/products?filters[brand][id][$eq]=${brandId}&populate=*`),
  
  // Para búsqueda (futuro)
  searchProducts: (query) => 
    api.get(`/products?filters[name][$containsi]=${query}&populate=*`),
};