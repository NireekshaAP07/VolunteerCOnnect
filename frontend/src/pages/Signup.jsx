import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak. Use at least 6 characters.'
          : 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-text-secondary">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-2 mb-8 justify-center">
        <div className="bg-emerald-500 p-2 rounded-xl text-white">
          <Heart size={24} fill="white" />
        </div>
        <h1 className="text-2xl font-bold">VOlunteerConect</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Create your account</h2>

        {/* Role selector */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              role === 'volunteer' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-border-color'
            }`}
            onClick={() => setRole('volunteer')}
          >
            <User size={24} />
            <span className="font-bold text-sm">Volunteer</span>
          </button>
          <button
            type="button"
            className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              role === 'ngo' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-border-color'
            }`}
            onClick={() => setRole('ngo')}
          >
            <Shield size={24} />
            <span className="font-bold text-sm">NGO Admin</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">
              {role === 'ngo' ? 'Organisation Name' : 'Full Name'}
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
              placeholder={role === 'ngo' ? 'e.g. Green Earth Foundation' : 'Enter your name'}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
              placeholder="email@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
              placeholder="Min. 6 characters"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 mt-4"
          >
            {loading ? 'Creating account…' : `Sign Up as ${role === 'volunteer' ? 'Volunteer' : 'NGO'}`}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
