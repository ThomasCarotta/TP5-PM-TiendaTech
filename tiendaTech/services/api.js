// services/api.js
import axios from 'axios';

const API_URL = 'http://10.0.2.2:1337/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Interceptor para agregar timestamp y evitar cache
api.interceptors.request.use((config) => {
  // Agregar timestamp para evitar cache
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now() // Timestamp único
    };
  }
  return config;
});

// Servicios para productos
export const productService = {
  getProducts: () => api.get('/products?populate=*'),
  getProduct: (id) => api.get(`/products/${id}?populate=*`),
  getCategories: () => api.get('/categories?populate=*'),
  getBrands: () => api.get('/brands?populate=*'),
  
  // NUEVO: Actualizar stock después de compra
  updateStock: (items) => api.post('/products/update-stock', { items }),
  
  // Para forzar recarga sin cache
  getProductsNoCache: () => api.get(`/products?populate=*&_t=${Date.now()}`),
};