import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const breadcrumbMap = {
  '/': ['Campaigns', 'New Broadcast'],
  '/history': ['History', 'Campaign Logs'],
  '/templates': ['Templates', 'Manage Templates'],
  '/analytics': ['Analytics', 'Dashboard'],
  '/settings': ['Settings', 'Configuration'],
};

export default function Header({ onToggleMobileMenu }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [parent, current] = breadcrumbMap[location.pathname] || ['', 'Page'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden text-gray-500 hover:text-gray-800 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
        <div className="text-xs text-gray-400 font-medium">
          {parent} / <span className="text-gray-700">{current}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> API Healthy
        </span>
        <i className="fas fa-bell text-gray-400 cursor-pointer hover:text-gray-600"></i>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
}