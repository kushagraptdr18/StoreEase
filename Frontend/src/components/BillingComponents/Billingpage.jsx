import React, { useEffect, useState } from 'react';
import NavigationBar from '../Header/NavigationBar';
import ProductList from './ProductList';
import AddToBillList from './AddtoBillList';
import axiosInstance from '../utils/axiosInstance';

const Billingpage = () => {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false); // New state for toggling form

  const originalTotal = billItems.reduce((sum, item) => sum + item.sp * item.quantity, 0);
  const totalDiscount = billItems.reduce(
    (sum, item) => sum + (item.sp * item.discount * item.quantity) / 100,
    0
  );
  const amountToPay = originalTotal - totalDiscount;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/product/');
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToBill = (productWithQuantity) => {
    const existingItem = billItems.find((item) => item._id === productWithQuantity._id);
    if (existingItem) {
      alert('This product is already added to the bill.');
      return;
    }
    setBillItems((prevItems) => [...prevItems, productWithQuantity]);
  };

  const handleQuantityChange = (id, change) => {
    setBillItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: Math.min(Math.max(item.quantity + change, 1), item.stock) } : item
      )
    );
  };

  const handleRemoveItem = (id) => setBillItems((prevItems) => prevItems.filter((item) => item._id !== id));

  const handleGenerateBill = async () => {
    if (!customerName || !customerPhone) {
      alert('Please enter customer name and phone.');
      return;
    }
    if (billItems.length === 0) {
      alert('No products added to the bill.');
      return;
    }

    const payload = {
      name: customerName,
      phone: customerPhone,
      amount: receivedAmount ? parseFloat(receivedAmount) : amountToPay,
      paymentMode,
      items: billItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        sp: item.sp,
        discount: item.discount,
        cp:item.cp
      })),
    };

    setIsGenerating(true);

    try {
      const response = await axiosInstance.post('/api/bill/createBill', payload);
      if (response.data.success) {
        alert('Bill created successfully!');
        setBillItems([]);
        setCustomerName('');
        setCustomerPhone('');
        setReceivedAmount('');
        setShowCustomerForm(false); // Hide form after successful generation
      } else {
        alert(response.data.message || 'Failed to create bill.');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-6">Billing Page</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel: Product List */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Products</h2>
            <ProductList products={products} onAddToBill={handleAddToBill} billItems={billItems} />
          </div>

          {/* Right Panel: Bill Details */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bill Details</h2>
            <AddToBillList billItems={billItems} onQuantityChange={handleQuantityChange} onRemoveItem={handleRemoveItem} />

            {/* Totals Summary */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p><span className="font-semibold">Original Total:</span> ₹{originalTotal.toFixed(2)}</p>
              <p className="text-red-500"><span className="font-semibold">Total Discount:</span> -₹{totalDiscount.toFixed(2)}</p>
              <p className="font-bold mt-2"><span>Amount to Pay:</span> ₹{amountToPay.toFixed(2)}</p>
            </div>

            {/* Show OK button if form is hidden */}
            {!showCustomerForm && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCustomerForm(true)}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  OK
                </button>
              </div>
            )}

            {/* Customer Details & Payment Form */}
            {showCustomerForm && (
              <div className="mt-6 p-4 bg-white rounded-lg border shadow">
                <h3 className="text-lg font-semibold mb-3">Customer Details & Payment</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter customer phone"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Received Amount (₹) <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    placeholder={`${amountToPay.toFixed(2)}`}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="cash">Cash</option>
                    <option value="debt">Debt</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateBill}
                  className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating Bill...' : 'Generate Bill'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billingpage;
