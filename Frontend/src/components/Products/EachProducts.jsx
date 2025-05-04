import React, { useState, useEffect } from 'react';
import ProductRow from './ProductRow';

const EachProducts = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [stockFilter, setStockFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    filterAndSearchProducts();
  }, [products, searchTerm, stockFilter, priceFilter]);

  const filterAndSearchProducts = () => {
    let updatedProducts = [...products];

   
    if (searchTerm.trim() !== '') {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stock filter
    if (stockFilter === 'lowStock') {
      updatedProducts = updatedProducts.filter((product) => product.stock < 5);
    }

    // Price filter
    if (priceFilter === 'spLessThan100') {
      updatedProducts = updatedProducts.filter((product) => product.sp < 100);
    } else if (priceFilter === 'spGreaterThan200') {
      updatedProducts = updatedProducts.filter((product) => product.sp > 200);
    }

    setFilteredProducts(updatedProducts);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, brand, or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Filter by Stock</option>
          <option value="lowStock">Stock Less than 5</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Filter by Selling Price</option>
          <option value="spLessThan100">Selling Price Less than 100</option>
          <option value="spGreaterThan200">Selling Price Greater than 200</option>
        </select>
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-6 text-center">Name</th>
            <th className="py-3 px-6 text-center">Brand</th>
            <th className="py-3 px-6 text-center">Cost Price</th>
            <th className="py-3 px-6 text-center">Selling Price</th>
            <th className="py-3 px-6 text-center">Stock</th>
            <th className="py-3 px-6 text-center">Discount</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onRemove={(id) => setProducts(products.filter((p) => p._id !== id))}
                onUpdate={(updatedProduct) =>
                  setProducts(
                    products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
                  )
                }
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EachProducts;
