import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import PaymentConfirmation from './components/PaymentConfirmation';
import FallbackPaymentForm from './components/FallbackPaymentForm';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // User will be redirected automatically due to the auth state change
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mpesa-green"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/scan" element={user ? <QRScanner /> : <Navigate to="/login" />} />
          <Route path="/confirm-payment" element={user ? <PaymentConfirmation /> : <Navigate to="/login" />} />
          <Route path="/fallback-payment" element={user ? <FallbackPaymentForm /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;