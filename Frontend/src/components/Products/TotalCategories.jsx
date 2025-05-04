import React from 'react';

const TotalCategories = () => {
  // Assume fetching total categories dynamically
  return (
    <div className="bg-green-200  w-fit p-8 rounded-lg shadow-md flex items-center gap-3 flex-col">
      <h3 className="text-xl font-semibold">Total Categories</h3>
      <p className="text-lg font-semibold">10</p>
    </div>
  );
};

export default TotalCategories;
