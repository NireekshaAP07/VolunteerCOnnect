import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Firebase user
  const [profile, setProfile] = useState(null); // Backend profile { role, points, name }
  const [loading, setLoading] = useState(true);

  // Load backend profile whenever Firebase user changes
  const loadProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    try {
      const { data } = await api.get(`/api/users/${firebaseUser.uid}`);
      setProfile(data);
    } catch {
      // Profile doesn't exist yet (new user) — set minimal profile
      setProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'volunteer', points: 0 });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await loadProfile(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Sign up → Firebase + create backend profile
  const signup = async (name, email, password, role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const { data } = await api.post('/api/users', {
      uid: cred.user.uid,
      name,
      email,
      role,
    });
    setProfile(data);
    return cred;
  };

  // Sign out
  const logout = () => signOut(auth);

  // Refresh profile from backend (e.g. after earning points)
  const refreshProfile = () => user && loadProfile(user);

  const role = profile?.role || 'volunteer';
  const points = profile?.points || 0;

  return (
    <AuthContext.Provider value={{ user, currentUser: user, profile, role, points, loading, login, signup, logout, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
