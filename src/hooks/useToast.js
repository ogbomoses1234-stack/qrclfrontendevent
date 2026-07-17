import { useContext } from 'react';
import { ToastContext } from '../components/layout/Toast';

export const useToast = () => useContext(ToastContext);