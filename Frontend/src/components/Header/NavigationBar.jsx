import React from 'react'
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };
    return (
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand Name */}
          <div className="text-2xl font-bold">Shopkeeper App</div>
  
          {/* Navigation Links */}
          <div className="flex space-x-6 items-center">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/product" className="hover:underline">
              Products
            </a>
            <a href="/customer" className="hover:underline">
              Customer
            </a>
            <a href="/summary" className="hover:underline">
              Summary
            </a>
            <a href="#" className="hover:underline">
              Profile
            </a>

            <button onClick={handleLogout} className='p-2 bg-red-700 cursor-pointer rounded'>
              Logout
            </button>
            
          </div>
        </div>
      </nav>
    );
  };

export default NavigationBar
