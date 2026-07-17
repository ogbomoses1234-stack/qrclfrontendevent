import api from './api';

export const getTemplates = () =>
  api.get('/templates');

export const getTemplateById = (id) =>
  api.get(`/templates/${id}`);

export const createTemplate = (templateData) =>
  api.post('/templates', templateData);

export const updateTemplate = (id, templateData) =>
  api.put(`/templates/${id}`, templateData);

export const deleteTemplate = (id) =>
  api.delete(`/templates/${id}`);

export const cloneTemplate = (id) =>
  api.post(`/templates/${id}/clone`);