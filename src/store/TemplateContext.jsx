import { createContext, useState, useCallback } from 'react';

export const TemplateContext = createContext(null);

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // API call – replace with actual service
      // const data = await getTemplates();
      // setTemplates(data);
    } catch (err) {
      console.error('Failed to fetch templates', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTemplate = useCallback((template) => {
    setTemplates((prev) => [...prev, template]);
  }, []);

  const updateTemplate = useCallback((id, updates) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const removeTemplate = useCallback((id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    templates,
    loading,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};