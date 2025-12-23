import API from './api';

// All routes go through API Gateway
export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const patchProduct = (id, data) => API.patch(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);