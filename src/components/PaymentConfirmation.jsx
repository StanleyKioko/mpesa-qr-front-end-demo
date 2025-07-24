import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import React, { useState } from 'react';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  // Get payment details from location state
  const { phoneNumber, amount } = location.state || { phoneNumber: '', amount: 0 };
  
  if (!phoneNumber || !amount) {
    // Redirect back to scanner if no payment details
    navigate('/scan');
    return null;
  }
  
  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, you would call your Firebase Function for STK push
      // const response = await triggerSTKPush(phoneNumber, amount);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      setPaymentStatus('success');
      
      // In reality, you might want to listen to a webhook or database update to confirm payment
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBack = () => {
    navigate('/scan');
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-mpesa-green">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-mpesa-green">Confirm Payment</h1>
              <p className="text-mpesa-gray mt-2">Please verify the payment details below</p>
            </div>
            
            {!paymentStatus ? (
              <>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium text-mpesa-gray">Phone Number</h3>
                    <p className="mt-1 text-xl font-semibold text-mpesa-gray-dark">{phoneNumber}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium text-mpesa-gray">Amount</h3>
                    <p className="mt-1 text-xl font-semibold text-mpesa-green">KES {parseFloat(amount).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-mpesa-gray-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                    >
                      Back
                    </button>
                    
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isProcessing ? 'bg-mpesa-green-light' : 'bg-mpesa-green hover:bg-mpesa-green-dark'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green`}
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              </>
            ) : paymentStatus === 'success' ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mpesa-green-light/30">
                  <svg className="h-10 w-10 text-mpesa-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-3 text-xl font-medium text-mpesa-gray-dark">Payment Successful!</h3>
                <p className="mt-2 text-mpesa-gray">
                  Payment of KES {parseFloat(amount).toFixed(2)} to {phoneNumber} was successful.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleGoToDashboard}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mpesa-green hover:bg-mpesa-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mpesa-red-light/30">
                  <svg className="h-10 w-10 text-mpesa-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mt-3 text-xl font-medium text-mpesa-gray-dark">Payment Failed</h3>
                <p className="mt-2 text-mpesa-gray">
                  There was an issue processing your payment. Please try again.
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mpesa-green hover:bg-mpesa-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-mpesa-gray-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                  >
                    Back to Scanner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;