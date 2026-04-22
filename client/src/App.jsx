import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ExpenseManager</h1>
          <nav>
            {localStorage.getItem('token') ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </header>
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
