import React from 'react';

const TotalAmount = () => {
  // Assume fetching investment data dynamically
  return (
    <div className="bg-blue-200  w-fit p-8 rounded-lg shadow-md flex items-center gap-3 flex-col">
      <h3 className="text-xl font-semibold">Total Investment</h3>
      <p className="text-lg font-semibold">$1,000,000</p>
    </div>
  );
};

export default TotalAmount;
