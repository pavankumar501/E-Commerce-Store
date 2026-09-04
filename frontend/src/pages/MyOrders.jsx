import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get('/api/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const statusColors = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-indigo-100 text-indigo-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const paymentColors = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600'
  };

  if (loading) return <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-3xl text-primary-500"></i></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here.</p>
          <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg inline-block transition">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center text-sm border-b">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-gray-500">Order placed:</span>
                    <span className="ml-1 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <span className="ml-1 font-mono text-xs">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment:</span>
                    <span className={`ml-1 font-medium uppercase ${paymentColors[order.paymentStatus]}`}>{order.paymentStatus}</span>
                  </div>
                </div>
                <span className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <img src={item.product?.image} alt="" className="w-14 h-14 object-contain border rounded" onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }} />
                      <div className="flex-1">
                        <Link to={`/product/${item.product?._id}`} className="text-sm font-medium text-gray-800 hover:text-primary-600">
                          {item.product?.name || 'Product unavailable'}
                        </Link>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Shipping to: </span>
                    <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm">Total: </span>
                    <span className="text-lg font-bold text-primary-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
