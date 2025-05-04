import React, { useEffect, useState } from 'react';
import NavigationBar from '../Header/NavigationBar';
import Sales from '../Home/Sales';
import CustomerList from './CustomerList';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CashAmount from './CashAmount';
import DebtAmount from './DebtAmount';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    bills: [],
    cash: 0,
    debt: 0,
    totalSales: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/showData');
      console.log(response.data);
            
      if (response.data.success) {
        setData({
          bills: response.data.bills,
          cash: response.data.cash,
          debt: response.data.debt,
          totalSales: response.data.totalSales,
        });
      }
    } catch(err) {
      console.log(err);
      
      alert('Error fetching products');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleCreateBill = () => {
    navigate('/createBill');
  };

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Stats Section */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Sales totalSales={data.totalSales} />
        <CashAmount cash={data.cash} />
        <DebtAmount debt={data.debt} />
      </div>

      {/* Main Content */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleCreateBill}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-md text-lg"
        >
          Create Bill
        </button>
      </div>

    

      {/* Customer List */}
      <CustomerList bills={data.bills} />
    </div>
  );
};

export default Home;
