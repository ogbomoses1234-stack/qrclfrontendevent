import api from './api';

// Get all designs for the logged‑in user
export const getDesigns = () => api.get('/designs');
export const updateDesign = (id, data) => api.put(`/designs/${id}`, data);
export const deleteDesign = (id) => api.delete(`/designs/${id}`);
// Create a new design (sends multipart/form‑data)
export const createDesign = (formData) =>
  api.post('/designs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });