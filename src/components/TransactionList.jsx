import React from 'react';

const TransactionList = ({ transactions, showFilters = false }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-mpesa-gray">
        No transactions found for the selected period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray uppercase tracking-wider">
              Transaction ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray uppercase tracking-wider">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray uppercase tracking-wider">
              Phone Number
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mpesa-gray uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
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
  );
};

export default TransactionList;