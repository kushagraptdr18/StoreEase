import React from 'react';

const SalesBox = ({totalSales}) => {
  
  
  return (
    <div className="bg-blue-100 p-6 shadow-lg rounded-xl text-center">
      <h3 className="text-xl font-semibold text-blue-700">Total Sales</h3>
      <p className="text-3xl font-bold mt-2">₹{totalSales}</p>
    </div>
  );
};

export default SalesBox;
