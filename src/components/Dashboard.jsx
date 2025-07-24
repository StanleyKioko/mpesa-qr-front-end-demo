import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import TransactionList from './TransactionList';

const Dashboard = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [dailyTotal, setDailyTotal] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data for demo
    const fetchTransactions = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTransactions = [
          { id: 't1', amount: 1200, phoneNumber: '254712345678', date: '2025-07-24T14:32:00', status: 'paid' },
          { id: 't2', amount: 850, phoneNumber: '254723456789', date: '2025-07-24T10:15:00', status: 'paid' },
          { id: 't3', amount: 3500, phoneNumber: '254734567890', date: '2025-07-23T16:45:00', status: 'paid' },
          { id: 't4', amount: 1500, phoneNumber: '254745678901', date: '2025-07-23T09:20:00', status: 'failed' },
          { id: 't5', amount: 2000, phoneNumber: '254756789012', date: '2025-07-22T13:10:00', status: 'paid' },
        ];
        
        setTransactions(mockTransactions);
        
        // Calculate daily total for today's transactions
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todaysTransactions = mockTransactions.filter(
          t => new Date(t.date).toISOString().split('T')[0] === today && t.status === 'paid'
        );
        
        const total = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
        setDailyTotal(total);
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    
    // Recalculate daily total for selected date
    if (e.target.value) {
      const selectedDate = e.target.value;
      const filteredTransactions = transactions.filter(
        t => new Date(t.date).toISOString().split('T')[0] === selectedDate && t.status === 'paid'
      );
      
      const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
      setDailyTotal(total);
    } else {
      // Reset to today's total
      const today = new Date().toISOString().split('T')[0];
      const todaysTransactions = transactions.filter(
        t => new Date(t.date).toISOString().split('T')[0] === today && t.status === 'paid'
      );
      
      const total = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
      setDailyTotal(total);
    }
  };
  
  const handleLogout = () => {
    // Call the passed logout function
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };
  
  const handleScanQR = () => {
    navigate('/scan');
  };
  
  // Filter transactions based on date filter
  const filteredTransactions = dateFilter
    ? transactions.filter(t => new Date(t.date).toISOString().split('T')[0] === dateFilter)
    : transactions;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mpesa-green">Merchant Dashboard</h1>
            <p className="text-mpesa-gray mt-1">Manage your transactions and payments</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleScanQR}
              className="bg-mpesa-green hover:bg-mpesa-green-dark text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zm-2 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zm8-12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2V5h1v1h-1zm-2 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
              </svg>
              Scan QR Code
            </button>
            
            <button
              onClick={handleLogout}
              className="border border-mpesa-gray-light text-mpesa-gray hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 border-t-4 border-mpesa-green">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-mpesa-gray-dark">Today's Summary</h2>
              <div className="bg-mpesa-green-light/20 text-mpesa-green-dark text-xs px-2 py-1 rounded-full">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-mpesa-green">KES {dailyTotal.toLocaleString()}</div>
              <p className="text-mpesa-gray text-sm mt-1">Total daily revenue</p>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border-t-4 border-mpesa-green">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-mpesa-gray-dark">Transactions</h2>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-mpesa-green">{transactions.length}</div>
              <p className="text-mpesa-gray text-sm mt-1">Total transactions</p>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border-t-4 border-mpesa-green">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-mpesa-gray-dark">Success Rate</h2>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-mpesa-green">
                {transactions.length > 0 
                  ? Math.round((transactions.filter(t => t.status === 'paid').length / transactions.length) * 100)
                  : 0}%
              </div>
              <p className="text-mpesa-gray text-sm mt-1">Payment success rate</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-mpesa-green">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-mpesa-gray-dark">Transaction History</h2>
              
              <div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mpesa-green"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mpesa-green"></div>
            </div>
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;