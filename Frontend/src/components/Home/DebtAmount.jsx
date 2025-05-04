import React from 'react';

const DebtAmount = ({debt}) => {
  return (
    <div className="bg-green-100 p-6 shadow-lg rounded-xl text-center">
      <h3 className="text-xl font-semibold text-green-700">Debt Amount</h3>
      <p className="text-3xl font-bold mt-2">{debt}</p>
    </div>
  );
};

export default DebtAmount;
