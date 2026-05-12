import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-6 container mx-auto">
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

      <main className="flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Connect. <br/>
            <span className="text-emerald-500">Contribute.</span> <br/>
            Change.
          </h2>
          <p className="text-text-secondary mb-10 text-lg lg:text-xl max-w-xl">
            A smart resource allocation platform for NGOs and volunteers to build a better world together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <button 
              onClick={() => navigate('/signup')}
              className="btn btn-primary flex-1 py-4 text-lg"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn bg-white border border-border-color text-text-primary flex-1 py-4 text-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              Login
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 mt-12 lg:mt-0 flex-1">
          <motion.div 
            whileHover={{ y: -5 }}
            className="card flex flex-col items-center text-center p-8 bg-blue-50/30 border-blue-100"
          >
            <div className="p-4 bg-blue-500 rounded-2xl text-white mb-4">
              <Shield size={40} />
            </div>
            <h3 className="font-bold text-lg mb-2">NGO Admin</h3>
            <p className="text-sm text-text-secondary">Post events & manage community impact</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="card flex flex-col items-center text-center p-8 bg-emerald-50/30 border-emerald-100"
          >
            <div className="p-4 bg-emerald-500 rounded-2xl text-white mb-4">
              <Users size={40} />
            </div>
            <h3 className="font-bold text-lg mb-2">Volunteer</h3>
            <p className="text-sm text-text-secondary">Join causes, earn points & build your profile</p>
          </motion.div>
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-border-color text-center text-text-secondary text-sm">
        &copy; 2026 VOlunteerConect. Empowering Communities.
      </footer>
    </div>
  );
};

export default Home;
