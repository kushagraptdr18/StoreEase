import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import ProductPage from './components/Products/ProductPage';
import Billingpage from './components/BillingComponents/Billingpage';
import AllCustomer from './components/Customers/AllCustomer';
import Summary from './components/Summary/Summary';


const App = () => {
 
  return (
    
      <Routes>
         
        <Route path="/login" element={<Login />} />
      
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute />}>
         
        <Route path="/" element={<Home />} /> 
        
        <Route path="/product" element={<ProductPage/>}></Route>

        <Route path='/createBill' element={<Billingpage/>}></Route>

        <Route path='/customer' element={<AllCustomer/>}></Route>

        <Route path='/summary' element={<Summary/>}></Route>


          
        </Route>

      </Routes>
      );
};

export default App;
