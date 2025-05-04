import React, { useEffect, useState } from 'react';
import NavigationBar from '../Header/NavigationBar';
import axiosInstance from '../utils/axiosInstance';

const AllCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Function to fetch the customer list
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/api/customer/getAll');
      setCustomers(response.data.f); // Assuming response.data.f holds the array of customers
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleManageDebt = (customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount)) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      const data = {
        phone: selectedCustomer.phone,
        amountPaid: Number(paymentAmount)
      };
      
      const response = await axiosInstance.post('/api/customer/payDebt', data);
      alert(`Payment successful: ${response.data.message}`);
      setSelectedCustomer(null);
      // Refresh the customer list after successful payment
      fetchCustomers();
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment failed, please try again.');
    }
  };

  return (
    <div className="">
      <NavigationBar />
      <h1 className="text-2xl font-bold my-4 text-center">All Customers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Debt</th>
              <th className="py-2 px-4">Reward Points</th>
              <th className="py-2 px-4">Manage Debt</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id} className="text-center border-b">
                  <td className="py-2 px-4">{customer.name}</td>
                  <td className="py-2 px-4">{customer.phone}</td>
                  <td className="py-2 px-4">{customer.debt}</td>
                  <td className="py-2 px-4">{customer.RewardPoints}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      onClick={() => handleManageDebt(customer)}
                    >
                      Manage Debt
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal or inline form for managing debt */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Manage Debt for {selectedCustomer.name}
            </h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label htmlFor="paymentAmount" className="block text-gray-700 mb-2">
                  Enter Amount to Pay:
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCustomer;
