import React, { useState } from 'react';

const ProductList = ({ products, onAddToBill, billItems }) => {
  // quantities maintained as an object keyed by product._id (or id)
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, change, stock) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      // Prevent quantity falling below 1 or exceeding available stock
      const updatedQuantity = Math.min(Math.max(1, current + change), stock);
      return { ...prev, [id]: updatedQuantity };
    });
  };

  const handleAddToBill = (product) => {
    const productId = product._id || product.id;
    const selectedQty = quantities[productId] || 1;

    // Check if product is already added
    const alreadyAdded = billItems.some((item) => (item._id || item.id) === productId);
    if (alreadyAdded) {
      alert('This product is already added to the bill.');
      return;
    }

    if (selectedQty > product.stock) {
      alert('The selected quantity is not available.');
      return;
    }

    onAddToBill({ ...product, quantity: selectedQty });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => {
            const productId = product._id || product.id;
            return (
              <div key={productId} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Brand: {product.brand}</p>
                <p>Stock: {product.stock}</p>
                <p>Selling Price: ₹{product.sp}</p>
                <p>Discount: {product.discount}%</p>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(productId, -1, product.stock)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                    disabled={(quantities[productId] || 1) <= 1}
                  >
                    -
                  </button>
                  <span className="mx-3">{quantities[productId] || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(productId, 1, product.stock)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                    disabled={(quantities[productId] || 1) >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="mt-3 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
                  onClick={() => handleAddToBill(product)}
                >
                  Add to Bill
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
