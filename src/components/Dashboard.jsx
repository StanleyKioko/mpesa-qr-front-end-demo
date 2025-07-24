import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Header from './Header';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [dailyTotal, setDailyTotal] = useState(0);
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
        
        setTransactions(transactionData);
        
        // Calculate daily total for today's transactions
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todaysTransactions = transactionData.filter(
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
  
  // Other functions remain similar...

  return (
    // Your existing JSX with updated styling for M-Pesa colors
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Rest of the component remains the same but with updated M-Pesa styling */}
    </div>
  );
};

export default Dashboard;