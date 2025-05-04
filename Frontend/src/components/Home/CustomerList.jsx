import React from 'react';
import CustomerRow from '../Home/CustomerRow';

const CustomerList = ({ bills }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Customer Purchases Today</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-6 text-center">Customer Name</th>
            <th className="py-3 px-6 text-center">Mobile Number</th>
            <th className="py-3 px-6 text-center">Amount Paid</th>
            <th className="py-3 px-6 text-center">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <CustomerRow key={index} customer={bill} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
