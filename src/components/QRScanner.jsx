import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import Header from './Header';

const QRScanner = () => {
  const [data, setData] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();
  
  const handleScan = (result) => {
    if (result) {
      setScanning(false);
      
      try {
        // Assuming QR code contains JSON data with phone and amount
        const scannedData = JSON.parse(result?.text);
        setData(result.text);
        
        if (scannedData.phone && scannedData.amount) {
          setPhoneNumber(scannedData.phone);
          setAmount(scannedData.amount);
        }
      } catch (error) {
        console.error('Error parsing QR data:', error);
        setData(result.text);
      }
    }
  };
  
  const handleError = (error) => {
    console.error(error);
  };
  
  const handleProceed = () => {
    navigate('/confirm-payment', { 
      state: { 
        phoneNumber, 
        amount: parseFloat(amount) 
      } 
    });
  };
  
  const handleReset = () => {
    setData('');
    setPhoneNumber('');
    setAmount('');
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-mpesa-green">
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-mpesa-green">Scan M-PESA QR Code</h1>
              <p className="text-mpesa-gray mt-2">
                {scanning 
                  ? 'Position the QR code within the frame to scan' 
                  : 'Review the scanned payment details'
                }
              </p>
            </div>
            
            {scanning ? (
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg bg-gray-100 border-2 border-dashed border-mpesa-green-light">
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={handleScan}
                  style={{ width: '100%' }}
                  scanDelay={300}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium text-mpesa-gray">Phone Number</h3>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 254712345678"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mpesa-green focus:border-mpesa-green"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium text-mpesa-gray">Amount (KES)</h3>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mpesa-green focus:border-mpesa-green"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-mpesa-gray-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green"
                  >
                    Scan Again
                  </button>
                  
                  <button
                    onClick={handleProceed}
                    disabled={!phoneNumber || !amount}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !phoneNumber || !amount ? 'bg-mpesa-green-light/50 cursor-not-allowed' : 'bg-mpesa-green hover:bg-mpesa-green-dark'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mpesa-green`}
                  >
                    Proceed
                  </button>
                </div>
                
                {data && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-mpesa-gray">Raw QR Data</h3>
                    <div className="mt-2 p-2 bg-gray-50 rounded overflow-auto text-xs text-gray-800 font-mono border border-gray-200">
                      {data}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 max-w-md mx-auto">
          <div className="text-center">
            <button
              onClick={() => navigate('/fallback-payment')}
              className="text-mpesa-red hover:text-mpesa-red-dark font-medium flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Can't scan? Enter payment details manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;