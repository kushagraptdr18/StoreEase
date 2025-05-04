import React from 'react';

const CashAmount = ({ cash }) => {
  
  
  
  return (
    <div className="bg-purple-100 p-6 shadow-lg rounded-xl text-center">
      <h3 className="text-xl font-semibold text-purple-700">Cash</h3>
      <p className="text-3xl font-bold mt-2">{cash}</p>
    </div>
  );
};

export default CashAmount;
