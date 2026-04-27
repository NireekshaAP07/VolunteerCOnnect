import React from 'react';
import VolunteerDashboard from './VolunteerDashboard';
import NGODashboard from './NGODashboard';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg text-white text-xs font-bold ${role === 'ngo' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
            {role === 'ngo' ? 'NGO' : 'VOL'}
          </div>
          <span className="text-xs font-bold text-text-secondary truncate max-w-[120px]">
            {profile?.name || profile?.email || 'User'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary border border-border-color"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-secondary border border-border-color text-red-500"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main>
        {role === 'ngo' ? <NGODashboard /> : <VolunteerDashboard />}
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
