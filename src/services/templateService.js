import api from './api';

export const getTemplates = () => api.get('/templates');

export const getTemplateById = (id) => api.get(`/templates/${id}`);

export const createTemplate = (templateData) => api.post('/templates', templateData);

export const updateTemplate = (id, templateData) => api.put(`/templates/${id}`, templateData);

export const deleteTemplate = (id) => api.delete(`/templates/${id}`);

export const deleteTemplateVariant = (templateId, variantIndex) =>
  api.delete(`/templates/${templateId}/variants/${variantIndex}`);

export const cloneTemplate = (id) => api.post(`/templates/${id}/clone`);

export const bulkDeleteTemplates = (ids) => api.post('/templates/bulk-delete', { ids });