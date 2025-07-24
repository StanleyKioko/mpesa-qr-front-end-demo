import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const FallbackPaymentForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const validatePhoneNumber = (phone) => {
    // Simple validation for Kenyan phone numbers
    const regex = /^(254|0)(7|1)[0-9]{8}$/;
    return regex.test(phone);
  };
  
  const validateAmount = (value) => {
    // Amount should be a positive number
    return value > 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Kenyan phone number';
    }
    
    if (!validateAmount(amount)) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // If validation passes, navigate to confirmation page
      navigate('/confirm-payment', { 
        state: { 
          phoneNumber, 
          amount: parseFloat(amount) 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-mpesa-green">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-mpesa-green">Manual Payment Entry</h1>
              <p className="text-mpesa-gray mt-2">Please enter the payment details</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-mpesa-gray mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 254712345678"
                  className={`block w-full px-3 py-2 border ${
                    errors.phoneNumber ? 'border-mpesa-red' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-mpesa-green focus:border-mpesa-green`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-mpesa-red">{errors.phoneNumber}</p>
                )}
                <p className="mt-1 text-sm text-mpesa-gray">
                  Enter the phone number in international format (e.g., 254712345678)
                </p>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-mpesa-gray mb-1">
                  Amount (KES)
                </label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={`block w-full px-3 py-2 border ${
                    errors.amount ? 'border-mpesa-red' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-mpesa-green focus:border-mpesa-green`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-mpesa-red">{errors.amount}</p>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/scan')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-mpesa-gray-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                >
                  Back to Scanner
                </button>
                
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mpesa-green hover:bg-mpesa-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackPaymentForm;