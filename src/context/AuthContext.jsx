import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USER = {
  id: 'usr-101',
  name: 'Elena Rostova',
  email: 'elena.r@stocksense.io',
  role: 'Inventory Director',
  department: 'Supply Chain Operations',
  company: 'StockSense Global Logistics',
  avatar: 'ER'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('stocksense_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Simulated OTP state
  const [activeOtp, setActiveOtp] = useState('482910');
  const [otpEmail, setOtpEmail] = useState('');

  // Synchronize auth state changes to localStorage immediately
  const saveAuthSession = (userData) => {
    try {
      localStorage.setItem('stocksense_user', JSON.stringify(userData));
      localStorage.setItem('stocksense_authenticated', 'true');
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuthSession = () => {
    try {
      localStorage.removeItem('stocksense_user');
      localStorage.setItem('stocksense_authenticated', 'false');
    } catch (e) {
      console.error('Failed to clear auth in localStorage', e);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  // Immediate synchronous login (zero async race conditions)
  const login = (email, password) => {
    const trimmedEmail = (email || '').trim();
    const isDemo = !trimmedEmail || trimmedEmail.toLowerCase() === DEMO_USER.email.toLowerCase();

    const loggedInUser = isDemo ? DEMO_USER : {
      id: `usr-${Date.now()}`,
      name: trimmedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: trimmedEmail,
      role: 'Operations Lead',
      department: 'Logistics & Warehousing',
      company: 'Enterprise Supply Hub',
      avatar: trimmedEmail.substring(0, 2).toUpperCase()
    };

    saveAuthSession(loggedInUser);
    return { success: true, user: loggedInUser };
  };

  const signup = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.fullName || 'Demo User',
      email: userData.email || 'user@company.com',
      role: userData.role || 'Inventory Specialist',
      department: userData.department || 'Warehouse Operations',
      company: userData.companyName || 'Global Logistics',
      avatar: (userData.fullName || 'DU').substring(0, 2).toUpperCase()
    };

    saveAuthSession(newUser);
    return { success: true, user: newUser };
  };

  const requestPasswordResetOtp = (email) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(randomCode);
    setOtpEmail(email);
    return { success: true, otp: randomCode, email };
  };

  const verifyOtp = (email, inputOtp) => {
    if (inputOtp === activeOtp || inputOtp === '123456') {
      return { success: true };
    }
    throw new Error('Invalid verification code. Please check the OTP sent to your email.');
  };

  const resetPassword = (email, newPassword) => {
    const trimmedEmail = (email || '').trim() || DEMO_USER.email;
    const isDemo = trimmedEmail.toLowerCase() === DEMO_USER.email.toLowerCase();
    
    const updatedUser = isDemo ? DEMO_USER : {
      id: `usr-${Date.now()}`,
      name: trimmedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: trimmedEmail,
      role: 'Inventory Specialist',
      department: 'Warehouse Management',
      company: 'StockSense Enterprise',
      avatar: trimmedEmail.substring(0, 2).toUpperCase()
    };

    saveAuthSession(updatedUser);
    return { success: true, user: updatedUser };
  };

  const logout = () => {
    clearAuthSession();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      activeOtp,
      otpEmail,
      login,
      signup,
      requestPasswordResetOtp,
      verifyOtp,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
