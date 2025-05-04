import React from 'react';

const CustomerRow = ({ customer }) => {
  console.log(customer);
  
  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="py-3 px-6 text-center">{customer.customerId.name}</td>
      <td className="py-3 px-6 text-center">{customer.customerId.phone}</td>
      <td className="py-3 px-6 text-center">₹{customer.amount}</td>
      <td
        className={`py-3 px-6 text-center ${
          customer.paymentMode === 'cash' ? 'text-red-600' : 'text-green-600'
        }`}
      >
        {customer.paymentMode}
      </td>
    </tr>
    
  );
};

export default CustomerRow;
