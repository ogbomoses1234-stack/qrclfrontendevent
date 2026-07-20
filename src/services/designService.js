import api from './api';

// Get all designs for the logged‑in user
export const getDesigns = () => api.get('/designs');

// Create a new design (sends multipart/form‑data)
export const createDesign = (formData) =>
  api.post('/designs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });