import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ToastNotifications';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import PublicPortfolio from './pages/PublicPortfolio';
import FloatingChat from './components/FloatingChat';
// import PeerMatchBackground from './components/PeerMatchBackground';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="app-container flex flex-col min-h-screen bg-[var(--bg-primary)]">
              {/* <PeerMatchBackground /> */}
              <Navbar />
              <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/portfolio/:id" element={<PublicPortfolio />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                  <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
                  <Route path="/event/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                </Routes>
              </main>
              {/* Bottom Nav is visible on smaller screens */}
              <div className="sm:hidden">
                <BottomNav />
              </div>
              <FloatingChat />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
