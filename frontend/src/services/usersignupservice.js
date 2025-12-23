import API from './api';

export const getUsers = () => API.get('/usersignups');
export const getUserById = (id) => API.get(`/usersignups/${id}`);
export const createUser = (data) => API.post('/usersignups', data);
export const updateUser = (id, data) => API.put(`/usersignups/${id}`, data);
export const patchUser = (id, data) => API.patch(`/usersignups/${id}`, data);
export const deleteUser = (id) => API.delete(`/usersignups/${id}`);
