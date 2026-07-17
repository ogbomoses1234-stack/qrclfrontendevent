import { CampaignProvider } from './CampaignContext';
import { TemplateProvider } from './TemplateContext';
import { ToastProvider } from '../components/layout/Toast';

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <TemplateProvider>
        <CampaignProvider>
          {children}
        </CampaignProvider>
      </TemplateProvider>
    </ToastProvider>
  );
};