import api from './api';

export const sendTestMessage = (phone, templateData) =>
  api.post('/whatsapp/test-send', { phone, ...templateData });

export const testConnection = () =>
  api.get('/whatsapp/health');

export const sendWebhookTest = () =>
  api.post('/whatsapp/webhook-test');

export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/whatsapp/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};