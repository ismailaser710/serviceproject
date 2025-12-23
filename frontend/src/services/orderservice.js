import API from './api';

export const getOrders = () => API.get('/orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const patchOrder = (id, data) => API.patch(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
