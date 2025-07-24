import React, { useState, useEffect } from 'react';
import Header from './Header';
import TransactionList from './TransactionList';
import MessagingComponent from './MessagingComponent';

const AdminPanel = ({ onLogout }) => {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState('merchants');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demonstration
  useEffect(() => {
    // This would typically be a fetch from a backend API
    const fetchMerchants = () => {
      setTimeout(() => {
        setMerchants([
          { id: 1, name: 'Shop ABC', email: 'shop.abc@example.com', transactionCount: 145, totalAmount: 78500 },
          { id: 2, name: 'Restaurant XYZ', email: 'restaurant.xyz@example.com', transactionCount: 89, totalAmount: 45620 },
          { id: 3, name: 'Grocery Store', email: 'grocery@example.com', transactionCount: 237, totalAmount: 103450 },
          { id: 4, name: 'Electronics Hub', email: 'electronics@example.com', transactionCount: 64, totalAmount: 215780 },
        ]);
        setIsLoading(false);
      }, 800);
    };
    
    fetchMerchants();
  }, []);

  const handleMerchantSelect = (merchant) => {
    setSelectedMerchant(merchant);
    setActiveTab('transactions');
  };

  // Mock transactions for selected merchant
  const getMerchantTransactions = () => {
    return [
      { id: 't1', amount: 1200, phoneNumber: '254712345678', date: '2025-07-22T14:32:00', status: 'paid' },
      { id: 't2', amount: 850, phoneNumber: '254723456789', date: '2025-07-22T10:15:00', status: 'paid' },
      { id: 't3', amount: 3500, phoneNumber: '254734567890', date: '2025-07-21T16:45:00', status: 'paid' },
      { id: 't4', amount: 1500, phoneNumber: '254745678901', date: '2025-07-21T09:20:00', status: 'failed' },
      { id: 't5', amount: 2000, phoneNumber: '254756789012', date: '2025-07-20T13:10:00', status: 'paid' },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-mpesa-green mb-2">Admin Dashboard</h1>
        <p className="text-mpesa-gray mb-8">Manage merchants, view transactions and system settings</p>
        
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('merchants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'merchants' 
                  ? 'border-mpesa-green text-mpesa-green'
                  : 'border-transparent text-gray-500 hover:text-mpesa-green hover:border-mpesa-green-light'
              }`}
            >
              Merchants
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions' 
                  ? 'border-mpesa-green text-mpesa-green'
                  : 'border-transparent text-gray-500 hover:text-mpesa-green hover:border-mpesa-green-light'
              } ${!selectedMerchant ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedMerchant}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('messaging')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messaging' 
                  ? 'border-mpesa-green text-mpesa-green'
                  : 'border-transparent text-gray-500 hover:text-mpesa-green hover:border-mpesa-green-light'
              }`}
            >
              Messaging
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings' 
                  ? 'border-mpesa-green text-mpesa-green'
                  : 'border-transparent text-gray-500 hover:text-mpesa-green hover:border-mpesa-green-light'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-mpesa-green">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mpesa-green"></div>
            </div>
          )}
          
          {/* Merchants Tab */}
          {!isLoading && activeTab === 'merchants' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold text-mpesa-gray-dark">Registered Merchants</h2>
                <button className="bg-mpesa-green hover:bg-mpesa-green-dark text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Merchant
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                        Transactions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                        Total Volume
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray-dark uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {merchants.map(merchant => (
                      <tr key={merchant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-mpesa-gray-dark">{merchant.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-mpesa-gray">{merchant.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-mpesa-gray">{merchant.transactionCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-mpesa-green">KES {merchant.totalAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleMerchantSelect(merchant)}
                            className="text-mpesa-green hover:text-mpesa-green-dark mr-3"
                          >
                            View
                          </button>
                          <button className="text-amber-600 hover:text-amber-700 mr-3">Edit</button>
                          <button className="text-mpesa-red hover:text-mpesa-red-dark">Disable</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {!isLoading && activeTab === 'transactions' && selectedMerchant && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-mpesa-gray-dark">
                  Transactions for {selectedMerchant.name}
                </h2>
                <p className="text-sm text-mpesa-gray mt-1">
                  View and manage transaction history for this merchant
                </p>
              </div>
              
              <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="bg-mpesa-green-light/20 hover:bg-mpesa-green-light/30 text-mpesa-green px-3 py-1 rounded-md text-sm font-medium">
                    Export CSV
                  </button>
                  <button className="bg-mpesa-green-light/20 hover:bg-mpesa-green-light/30 text-mpesa-green px-3 py-1 rounded-md text-sm font-medium">
                    Print
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-mpesa-gray mr-2">Filter by date:</span>
                  <input 
                    type="date" 
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-mpesa-green focus:border-mpesa-green"
                  />
                </div>
              </div>
              
              <TransactionList 
                transactions={getMerchantTransactions()} 
                showFilters={true}
              />
              
              <div className="mt-4 text-right">
                <button 
                  onClick={() => setActiveTab('merchants')}
                  className="text-mpesa-gray-dark hover:text-mpesa-green px-3 py-1 text-sm"
                >
                  ← Back to Merchants
                </button>
              </div>
            </div>
          )}
          
          {/* Messaging Tab */}
          {!isLoading && activeTab === 'messaging' && (
            <div>
              <h2 className="text-xl font-semibold text-mpesa-gray-dark mb-6">Messaging Center</h2>
              <MessagingComponent />
            </div>
          )}
          
          {/* Settings Tab */}
          {!isLoading && activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-mpesa-gray-dark mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-mpesa-gray-dark mb-3">API Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-mpesa-gray mb-1">M-Pesa API Key</label>
                      <div className="flex">
                        <input 
                          type="password" 
                          value="••••••••••••••••" 
                          readOnly 
                          className="bg-white p-2 flex-grow rounded-l border border-gray-300 focus:outline-none" 
                        />
                        <button className="bg-gray-200 px-3 text-mpesa-gray-dark rounded-r border-t border-r border-b border-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-mpesa-gray mb-1">M-Pesa Secret</label>
                      <div className="flex">
                        <input 
                          type="password" 
                          value="••••••••••••••••" 
                          readOnly 
                          className="bg-white p-2 flex-grow rounded-l border border-gray-300 focus:outline-none" 
                        />
                        <button className="bg-gray-200 px-3 text-mpesa-gray-dark rounded-r border-t border-r border-b border-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-mpesa-green hover:text-mpesa-green-dark flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Update API Keys
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-mpesa-gray-dark mb-3">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-mpesa-gray-dark">Email notifications</span>
                        <p className="text-xs text-mpesa-gray">Receive transaction alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mpesa-green rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mpesa-green"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-mpesa-gray-dark">SMS notifications</span>
                        <p className="text-xs text-mpesa-gray">Receive transaction alerts via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mpesa-green rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mpesa-green"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-mpesa-gray-dark">Failed transaction alerts</span>
                        <p className="text-xs text-mpesa-gray">Get immediate alerts for failed payments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mpesa-green rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mpesa-green"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-mpesa-gray-dark mb-3">Security Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-mpesa-gray mb-1">Login Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        defaultValue="30"
                        min="5"
                        max="120"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mpesa-green focus:border-mpesa-green"
                      />
                      <p className="mt-1 text-xs text-mpesa-gray">Users will be logged out after this period of inactivity</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-sm text-mpesa-gray-dark">Two-factor authentication</span>
                        <p className="text-xs text-mpesa-gray">Require 2FA for all admin users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mpesa-green rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mpesa-green"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="bg-white border border-gray-300 text-mpesa-gray-dark px-4 py-2 rounded-md text-sm font-medium mr-3 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="bg-mpesa-green hover:bg-mpesa-green-dark text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-mpesa-gray">
                © {new Date().getFullYear()} M-Pesa QR Payment System. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-mpesa-gray hover:text-mpesa-green">Terms of Service</a>
              <a href="#" className="text-sm text-mpesa-gray hover:text-mpesa-green">Privacy Policy</a>
              <a href="#" className="text-sm text-mpesa-gray hover:text-mpesa-green">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;