import { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('whatsapp_access_token'));
  const [loading, setLoading] = useState(true);

  // On mount, try to load user from token (in a real app you'd verify with backend)
  useEffect(() => {
    if (token) {
      // For now, we just decode the JWT to get basic info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email, name: payload.name || 'User' });
      } catch {
        // Token invalid, clear it
        localStorage.removeItem('whatsapp_access_token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password });
    const { token: newToken, user: userData } = res.data || res;
    localStorage.setItem('whatsapp_access_token', newToken);
    setToken(newToken);
    setUser({ id: userData.id, email: userData.email, name: userData.name });
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    const { token: newToken, user: userData } = res.data || res;
    localStorage.setItem('whatsapp_access_token', newToken);
    setToken(newToken);
    setUser({ id: userData.id, email: userData.email, name: userData.name });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('whatsapp_access_token');
    setToken(null);
    setUser(null);
  }, []);

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};