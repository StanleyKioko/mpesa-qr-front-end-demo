import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import Header from './Header';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [dailyTotal, setDailyTotal] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Get the current user's ID
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("No authenticated user");
          return;
        }
        
        // Create a query to get transactions for this merchant
        const transactionsRef = collection(db, 'transactions');
        let q = query(
          transactionsRef,
          where('merchantId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        // Format Firestore data
        const transactionData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            phoneNumber: data.phoneNumber,
            date: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
            status: data.status
          };
        });
        
        // If no transactions are found, use mock data for demo
        const finalData = transactionData.length > 0 ? transactionData : [
          { id: 't1', amount: 1200, phoneNumber: '254712345678', date: new Date().toISOString(), status: 'paid' },
          { id: 't2', amount: 850, phoneNumber: '254723456789', date: new Date(Date.now() - 3600000).toISOString(), status: 'paid' },
          { id: 't3', amount: 3500, phoneNumber: '254734567890', date: new Date(Date.now() - 86400000).toISOString(), status: 'paid' },
          { id: 't4', amount: 1500, phoneNumber: '254745678901', date: new Date(Date.now() - 86400000).toISOString(), status: 'failed' },
          { id: 't5', amount: 2000, phoneNumber: '254756789012', date: new Date(Date.now() - 172800000).toISOString(), status: 'paid' },
        ];
        
        setTransactions(finalData);
        setTotalTransactions(finalData.length);
        
        // Calculate success rate
        const successfulTransactions = finalData.filter(t => t.status === 'paid').length;
        const calculatedSuccessRate = finalData.length > 0 
          ? Math.round((successfulTransactions / finalData.length) * 100)
          : 0;
        setSuccessRate(calculatedSuccessRate);
        
        // Calculate daily total for today's transactions
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todaysTransactions = finalData.filter(
          t => new Date(t.date).toISOString().split('T')[0] === today && t.status === 'paid'
        );
        
        const total = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
        setDailyTotal(total);
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
        
        // Use mock data if there's an error
        const mockData = [
          { id: 't1', amount: 1200, phoneNumber: '254712345678', date: new Date().toISOString(), status: 'paid' },
          { id: 't2', amount: 850, phoneNumber: '254723456789', date: new Date(Date.now() - 3600000).toISOString(), status: 'paid' },
          { id: 't3', amount: 3500, phoneNumber: '254734567890', date: new Date(Date.now() - 86400000).toISOString(), status: 'paid' },
          { id: 't4', amount: 1500, phoneNumber: '254745678901', date: new Date(Date.now() - 86400000).toISOString(), status: 'failed' },
          { id: 't5', amount: 2000, phoneNumber: '254756789012', date: new Date(Date.now() - 172800000).toISOString(), status: 'paid' },
        ];
        
        setTransactions(mockData);
        setTotalTransactions(mockData.length);
        setSuccessRate(80); // 4 out of 5 are successful
        
        // Calculate daily total for mock data
        const today = new Date().toISOString().split('T')[0];
        const todaysTransactions = mockData.filter(
          t => new Date(t.date).toISOString().split('T')[0] === today && t.status === 'paid'
        );
        
        const total = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
        setDailyTotal(total);
        
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
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
      <Header />
      
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
              className="border border-gray-300 text-mpesa-gray-dark hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
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
              <div className="text-3xl font-bold text-mpesa-green">{totalTransactions}</div>
              <p className="text-mpesa-gray text-sm mt-1">Total transactions</p>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border-t-4 border-mpesa-green">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-mpesa-gray-dark">Success Rate</h2>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-mpesa-green">{successRate}%</div>
              <p className="text-mpesa-gray text-sm mt-1">Payment success rate</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-lg font-medium text-mpesa-gray-dark mb-3 md:mb-0">Transaction History</h2>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mpesa-green text-mpesa-gray-dark">
                    <option value="all">All Transactions</option>
                    <option value="paid">Paid Only</option>
                    <option value="failed">Failed Only</option>
                  </select>
                </div>
                <div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mpesa-green text-mpesa-gray-dark"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mpesa-green"></div>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-mpesa-gray-dark">{transaction.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-mpesa-gray-dark">
                          {new Date(transaction.date).toLocaleDateString()} 
                        </div>
                        <div className="text-sm text-mpesa-gray">
                          {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-mpesa-gray-dark">
                          KES {transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-mpesa-gray-dark">{transaction.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'paid'
                            ? 'bg-mpesa-green-light/30 text-mpesa-green-dark'
                            : 'bg-mpesa-red-light/30 text-mpesa-red-dark'
                        }`}>
                          {transaction.status === 'paid' ? 'Paid' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-mpesa-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-mpesa-gray-dark">No transactions found</h3>
              <p className="mt-1 text-sm text-mpesa-gray">No transactions match your current filter criteria.</p>
              {dateFilter && (
                <button 
                  onClick={() => setDateFilter('')}
                  className="mt-3 text-sm text-mpesa-green hover:text-mpesa-green-dark font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
          
          {filteredTransactions.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-mpesa-gray">
                Showing <span className="font-medium text-mpesa-gray-dark">{filteredTransactions.length}</span> transactions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-mpesa-green-light/20 text-mpesa-green rounded text-sm">Export CSV</button>
                <button className="px-3 py-1 bg-mpesa-green-light/20 text-mpesa-green rounded text-sm">Print</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-mpesa-gray-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleScanQR}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-mpesa-green-light/10 hover:border-mpesa-green-light transition-colors"
            >
              <div className="rounded-full bg-mpesa-green-light/20 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mpesa-green" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zm-2 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zm8-12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2V5h1v1h-1zm-2 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-mpesa-gray-dark">Scan QR Code</h3>
                <p className="text-xs text-mpesa-gray">Process a payment via QR code</p>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/fallback-payment')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-mpesa-green-light/10 hover:border-mpesa-green-light transition-colors"
            >
              <div className="rounded-full bg-mpesa-green-light/20 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mpesa-green" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-mpesa-gray-dark">Manual Payment</h3>
                <p className="text-xs text-mpesa-gray">Enter payment details manually</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-mpesa-green-light/10 hover:border-mpesa-green-light transition-colors">
              <div className="rounded-full bg-mpesa-green-light/20 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mpesa-green" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-mpesa-gray-dark">Download Report</h3>
                <p className="text-xs text-mpesa-gray">Generate transaction reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <p className="text-sm text-mpesa-gray">
              © {new Date().getFullYear()} M-Pesa QR Payment System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;