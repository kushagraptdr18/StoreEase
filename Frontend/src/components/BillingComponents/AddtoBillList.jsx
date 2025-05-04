import React from 'react';

const AddToBillList = ({ billItems, onQuantityChange, onRemoveItem }) => {
  // Calculate totals based on product selling price, discount and quantity.
  const originalTotal = billItems.reduce((sum, item) => sum + item.sp * item.quantity, 0);
  const totalDiscount = billItems.reduce(
    (sum, item) => sum + (item.sp * item.discount * item.quantity) / 100,
    0
  );
  const amountToPay = originalTotal - totalDiscount;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bill List</h2>
      {billItems.length === 0 ? (
        <p>No items added to the bill.</p>
      ) : (
        <div>
          {billItems.map((item) => (
            <div key={item._id || item.id} className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 shadow">
              <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex items-center mt-1">
                  <button
                    onClick={() => onQuantityChange(item._id, -1)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item._id, 1)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <p className="mt-1">
                  Discounted Price: ₹
                  {(item.sp - (item.sp * item.discount) / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold">
                  ₹{((item.sp - (item.sp * item.discount) / 100) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => onRemoveItem(item._id)}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

        
        </div>
      )}
    </div>
  );
};

export default AddToBillList;
