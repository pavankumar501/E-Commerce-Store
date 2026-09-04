import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = Math.min(newCart[index].stock, qty);
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg inline-block transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({cart.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div key={item.product} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
              <Link to={`/product/${item.product}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded" onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:text-primary-600 text-sm">
                  {item.name}
                </Link>
                <p className="text-lg font-bold text-primary-600 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 text-sm">
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 text-sm">
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 text-sm">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-green-600">
                  <i className="fas fa-info-circle mr-1"></i>Add ₹{(499 - subtotal).toLocaleString('en-IN')} more for free delivery
                </p>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            {user ? (
              <button onClick={() => navigate('/checkout')} className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition">
                Proceed to Checkout
              </button>
            ) : (
              <Link to="/login" className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition block text-center">
                Login to Checkout
              </Link>
            )}
            <Link to="/products" className="w-full mt-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition block text-center text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
