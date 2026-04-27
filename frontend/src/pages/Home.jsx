import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <Heart size={24} fill="white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">VOlunteerConect</h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary border border-border-color"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main className="flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Connect. <br/>
            <span className="text-emerald-500">Contribute.</span> <br/>
            Change.
          </h2>
          <p className="text-text-secondary mb-8 text-lg">
            A smart resource allocation platform for NGOs and volunteers to build a better world together.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="btn btn-primary w-full py-4 text-lg"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn bg-white border border-border-color text-text-primary w-full py-4 text-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              Login
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="card flex flex-col items-center text-center p-4">
            <Shield className="text-blue-500 mb-2" size={32} />
            <h3 className="font-bold text-sm">NGO Admin</h3>
            <p className="text-xs text-text-secondary">Post and manage events</p>
          </div>
          <div className="card flex flex-col items-center text-center p-4">
            <Users className="text-emerald-500 mb-2" size={32} />
            <h3 className="font-bold text-sm">Volunteer</h3>
            <p className="text-xs text-text-secondary">Earn points & help others</p>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-text-secondary text-sm">
        &copy; 2026 VOlunteerConect. Empowering Communities.
      </footer>
    </div>
  );
};

export default Home;
