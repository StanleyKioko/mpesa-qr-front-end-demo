import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import PaymentConfirmation from './components/PaymentConfirmation';
import FallbackPaymentForm from './components/FallbackPaymentForm';
import AdminPanel from './components/AdminPanel';

function App() {
  // Demo authentication state (no Firebase needed)
  const [user, setUser] = useState(null);
  
  // Demo login function to be passed to LoginPage
  const demoLogin = (email, password) => {
    // For demo purposes, accept any non-empty credentials
    if (email && password) {
      setUser({ uid: 'demo-user', email: email });
      return true;
    }
    return false;
  };

  // Demo logout function
  const demoLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !user ? 
              <LoginPage onLogin={demoLogin} /> : 
              <Navigate to="/dashboard" />
          } />
          <Route path="/dashboard" element={
            user ? 
              <Dashboard onLogout={demoLogout} /> : 
              <Navigate to="/login" />
          } />
          <Route path="/scan" element={
            user ? 
              <QRScanner /> : 
              <Navigate to="/login" />
          } />
          <Route path="/confirm-payment" element={
            user ? 
              <PaymentConfirmation /> : 
              <Navigate to="/login" />
          } />
          <Route path="/fallback-payment" element={
            user ? 
              <FallbackPaymentForm /> : 
              <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            user ? 
              <AdminPanel onLogout={demoLogout} /> : 
              <Navigate to="/login" />
          } />
          <Route path="*" element={
            <Navigate to={user ? "/dashboard" : "/login"} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;