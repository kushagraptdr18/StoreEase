import React, { useEffect, useState } from 'react';
import NavigationBar from '../Header/NavigationBar';
import TotalAmount from './TotalAmount';
import TotalCategories from './TotalCategories';
import axiosInstance from '../utils/axiosInstance';
import EachProducts from './EachProducts';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    brand: '',
    cp: 0,
    sp: 0,
    stock: 0,
    discount: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/product/');
      setProducts(response.data.products);
    } catch {
      alert('Error fetching products');
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      const response = await axiosInstance.post('/api/product/add', newProduct);
      alert('Product Added Successfully');
      setProducts([...products, response.data.product]);
      setShowPopup(false);
      setNewProduct({ name: '', category: '', brand: '', cp: 0, sp: 0, stock: 0, discount: 0 });
    } catch {
      alert('Error Adding Product');
    }
  };

  return (
    <div>
      <NavigationBar />
    
      <div className="p-8 flex justify-center gap-18 md:grid-cols-3 gap-6">
        <TotalCategories />
        <TotalAmount />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
        >
          Add Product
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form>
              {['name', 'category', 'brand', 'cp', 'sp', 'stock', 'discount'].map((field) => (
                <div key={field} className="mb-3">
                  <label className="block text-gray-600">{field.toUpperCase()}</label>
                  <input
                    type={field === 'cp' || field === 'sp' || field === 'stock' || field === 'discount' ? 'number' : 'text'}
                    name={field}
                    value={newProduct[field]}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EachProducts products={products} setProducts={setProducts} />

    </div>
  );
};

export default ProductPage;
