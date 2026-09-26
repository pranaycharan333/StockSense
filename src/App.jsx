import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Application Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import StockLedger from './pages/StockLedger';
import Warehouses from './pages/Warehouses';
import AIInsights from './pages/AIInsights';

// Hash URL redirector (if user visits /#/login or /#/products)
const HashRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.replace('#', '');
      window.history.replaceState(null, '', cleanPath);
      navigate(cleanPath, { replace: true });
    }
  }, [navigate]);

  return null;
};

// Protected Route Guard with synchronous storage fallback
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const hasAuthToken = typeof window !== 'undefined' && localStorage.getItem('stocksense_authenticated') === 'true';
  const isAuthed = isAuthenticated || hasAuthToken;

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <BrowserRouter>
          <HashRedirector />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="receipts" element={<Receipts />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="adjustments" element={<Adjustments />} />
              <Route path="ledger" element={<StockLedger />} />
              <Route path="warehouses" element={<Warehouses />} />
              <Route path="insights" element={<AIInsights />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
