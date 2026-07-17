import { useContext } from 'react';
import { TemplateContext } from '../store/TemplateContext';

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};