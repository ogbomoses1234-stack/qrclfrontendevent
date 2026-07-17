import api from './api';

export const getDashboard = () => api.get('/analytics/dashboard');

export const getMessagesOverTime = (days = 30) =>
  api.get('/analytics/messages-over-time', { params: { days } });

export const getTemplateUsage = () => api.get('/analytics/template-usage');