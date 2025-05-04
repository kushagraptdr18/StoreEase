import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ProductRow = ({ product, onRemove, onUpdate }) => {
  const [editableProduct, setEditableProduct] = useState({ ...product });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setEditableProduct({ ...editableProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.post(`/api/product/update/${editableProduct._id}`, editableProduct);
      alert('Product updated successfully');
      setIsEditing(false);
      onUpdate(editableProduct);
    } catch {
      alert('Error updating product');
    }
  };

  const handleRemove = async () => {
    try {
      await axiosInstance.delete(`/api/product/delete/${product._id}`);
      alert('Product removed successfully');
      onRemove(product._id);
    } catch {
      alert('Error removing product');
    }
  };

  return (
    <tr className="border-b hover:bg-gray-100">
      {isEditing ? (
        ["name", "brand", "cp", "sp", "stock", "discount"].map(field => (
          <td key={field} className="py-3 px-6 text-center">
            <input
              type="text"
              name={field}
              value={editableProduct[field]}
              onChange={handleInputChange}
              className="border p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </td>
        ))
      ) : (
        <>
          <td className="py-3 px-6 text-center">{product.name}</td>
          <td className="py-3 px-6 text-center">{product.brand}</td>
          <td className="py-3 px-6 text-center">{product.cp}</td>
          <td className="py-3 px-6 text-center">{product.sp}</td>
          <td className="py-3 px-6 text-center">{product.stock}</td>
          <td className="py-3 px-6 text-center">{product.discount}</td>
        </>
      )}
      <td className="py-3 px-6 text-center">
        {isEditing ? (
          <>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              onClick={handleRemove}
            >
              Remove
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
