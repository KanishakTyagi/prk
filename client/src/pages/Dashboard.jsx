import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { PlusCircle, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: ''
  });

  const categories = ['All', 'Food', 'Travel', 'Bills', 'Entertainment', 'Other'];
  const formCategories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other'];

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setFormData({ title: '', amount: '', category: 'Other', date: '' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredExpenses = useMemo(() => {
    if (filterCategory === 'All') return expenses;
    return expenses.filter(exp => exp.category === filterCategory);
  }, [expenses, filterCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex gap-8 flex-col lg:flex-row">
      {/* Add Expense Form */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PlusCircle className="text-blue-600" /> Add New Expense
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="E.g., Groceries"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {formCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date (Optional)</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>

      {/* Expenses List & Stats */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Expenses</p>
            <h3 className="text-4xl font-bold flex items-center gap-2">
              <Wallet className="w-8 h-8 opacity-80" />
              ₹{totalAmount.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filter by:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No expenses found for this category.</div>
            ) : (
              filteredExpenses.map((exp) => (
                <div key={exp._id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                        {exp.category}
                      </span>
                      <span>{new Date(exp.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹{exp.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
