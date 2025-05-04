import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NavigationBar from '../Header/NavigationBar';
import axiosInstance from '../utils/axiosInstance';

const Summary = () => {
  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [type, setType] = useState('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, profitResponse] = await Promise.all([
          axiosInstance.get(`/api/summary/checkSales?type=${type}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axiosInstance.get(`/api/summary/profit?type=${type}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        setSalesData(salesResponse.data);
        setProfitData(profitResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="p">
      <NavigationBar />
      <div className="my-4 p-4">
        <h2 className="text-2xl font-bold mb-2">Sales & Profit Summary</h2>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded mb-4"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Sales Summary</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Profit Summary</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={profitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalProfit" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;