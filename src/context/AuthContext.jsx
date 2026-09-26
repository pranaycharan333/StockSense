import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
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

  // Synchronize auth state changes to localStorage
  const saveAuthSession = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('stocksense_user', JSON.stringify(userData));
      localStorage.setItem('stocksense_authenticated', 'true');
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
  };

  const clearAuthSession = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('stocksense_user');
      localStorage.setItem('stocksense_authenticated', 'false');
    } catch (e) {
      console.error('Failed to clear auth in localStorage', e);
    }
  };

  // Mock API actions
  const login = async (email, password) => {
    await new Promise(res => setTimeout(res, 400)); // simulate latency
    
    // Accept demo email or any custom email
    const loggedInUser = {
      id: `usr-${Date.now()}`,
      name: email === DEMO_USER.email ? DEMO_USER.name : (email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())),
      email: email,
      role: 'Operations Lead',
      department: 'Logistics & Warehousing',
      company: 'Enterprise Supply Hub',
      avatar: email.substring(0, 2).toUpperCase()
    };

    saveAuthSession(loggedInUser);
    return { success: true, user: loggedInUser };
  };

  const signup = async (userData) => {
    await new Promise(res => setTimeout(res, 500));
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.fullName || 'Demo User',
      email: userData.email,
      role: userData.role || 'Inventory Specialist',
      department: userData.department || 'Warehouse Operations',
      company: userData.companyName || 'Global Logistics',
      avatar: (userData.fullName || 'DU').substring(0, 2).toUpperCase()
    };

    saveAuthSession(newUser);
    return { success: true, user: newUser };
  };

  const requestPasswordResetOtp = async (email) => {
    await new Promise(res => setTimeout(res, 450));
    // Generate realistic 6 digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(randomCode);
    setOtpEmail(email);
    return { success: true, otp: randomCode, email };
  };

  const verifyOtp = async (email, inputOtp) => {
    await new Promise(res => setTimeout(res, 350));
    // Accept both the generated OTP and universal hackathon fallback '123456'
    if (inputOtp === activeOtp || inputOtp === '123456') {
      return { success: true };
    }
    throw new Error('Invalid verification code. Please check the OTP sent to your email.');
  };

  const resetPassword = async (email, newPassword) => {
    await new Promise(res => setTimeout(res, 450));
    // Automatically log user in upon resetting password and set new user
    const updatedUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email,
      role: 'Inventory Specialist',
      department: 'Warehouse Management',
      company: 'StockSense Enterprise',
      avatar: email.substring(0, 2).toUpperCase()
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
