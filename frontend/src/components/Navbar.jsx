import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-emerald-500 font-outfit">
        VolunteerConnect
      </Link>
      
      <div className="flex items-center gap-4 hidden sm:flex">
        <ThemeToggle />
        {currentUser ? (
          <>
            <Link to="/events" className="text-sm font-semibold hover:text-emerald-500 text-[var(--text-primary)]">Events</Link>
            <Link to="/dashboard" className="text-sm font-semibold hover:text-emerald-500 text-[var(--text-primary)]">Dashboard</Link>
            <Link to="/profile" className="text-sm font-semibold hover:text-emerald-500 text-[var(--text-primary)]">Profile</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 font-semibold hover:text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 text-[var(--text-primary)]">Login</Link>
            <Link to="/signup" className="btn btn-primary text-sm px-4 py-2">Sign Up</Link>
          </>
        )}
      </div>
      
      {/* Mobile only theme toggle, the rest handled by BottomNav */}
      <div className="sm:hidden">
        <ThemeToggle />
      </div>
    </nav>
  );
}
