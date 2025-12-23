import API from './api';

export const getAdmins = () => API.get('/adminlogins');
export const getAdminById = (id) => API.get(`/adminlogins/${id}`);
export const createAdmin = (data) => API.post('/adminlogins', data);
export const updateAdmin = (id, data) => API.put(`/adminlogins/${id}`, data);
export const patchAdmin = (id, data) => API.patch(`/adminlogins/${id}`, data);
export const deleteAdmin = (id) => API.delete(`/adminlogins/${id}`);
