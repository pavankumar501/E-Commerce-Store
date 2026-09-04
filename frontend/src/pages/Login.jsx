import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              <i className="fas fa-store mr-2"></i>ShopHub
            </Link>
            <h2 className="text-xl font-bold text-gray-800 mt-4">Sign In</h2>
            <p className="text-sm text-gray-500">Enter your email and password to login</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:outline-none focus:border-primary-500" />
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm focus:outline-none focus:border-primary-500" />
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-medium">Sign Up</Link>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-400 text-center mb-2">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => { setEmail('admin@shophub.in'); setPassword('admin123'); }} className="bg-gray-100 hover:bg-gray-200 py-2 rounded text-center">
                <i className="fas fa-user-shield mr-1"></i>Admin
              </button>
              <button onClick={() => { setEmail('rahul@example.com'); setPassword('customer123'); }} className="bg-gray-100 hover:bg-gray-200 py-2 rounded text-center">
                <i className="fas fa-user mr-1"></i>Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
