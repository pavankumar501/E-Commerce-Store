import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/products/featured').then(r => setFeatured(r.data)).catch(() => {});
    axios.get('/api/products/deals').then(r => setDeals(r.data)).catch(() => {});
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const categoryIcons = {
    electronics: 'fas fa-laptop',
    fashion: 'fas fa-tshirt',
    'home-kitchen': 'fas fa-couch',
    books: 'fas fa-book-open',
    'sports-fitness': 'fas fa-dumbbell',
    grocery: 'fas fa-shopping-basket'
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Discover the Best Products at Amazing Prices</h1>
            <p className="text-lg mb-6 text-primary-100">Shop from thousands of products across electronics, fashion, home & more. Free delivery on orders above ₹499.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Shop Now
              </Link>
              <Link to="/products?sort=newest" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <i className="fas fa-truck text-3xl mb-2"></i>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-primary-200">On orders above ₹499</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <i className="fas fa-shield-alt text-3xl mb-2"></i>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-primary-200">100% secure checkout</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <i className="fas fa-undo text-3xl mb-2"></i>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-primary-200">7-day return policy</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <i className="fas fa-headset text-3xl mb-2"></i>
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-primary-200">Dedicated help center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-200 transition">
                <i className={`${categoryIcons[cat.slug] || 'fas fa-tag'} text-primary-600 text-xl`}></i>
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {deals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              <i className="fas fa-bolt text-yellow-500 mr-2"></i>Deals of the Day
            </h2>
            <Link to="/products" className="text-primary-600 hover:underline text-sm font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              <i className="fas fa-star text-yellow-400 mr-2"></i>Featured Products
            </h2>
            <Link to="/products" className="text-primary-600 hover:underline text-sm font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-primary-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Join ShopHub Today</h2>
          <p className="mb-4 text-primary-100">Sign up and get exclusive deals, early access to sales, and more.</p>
          <Link to="/register" className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  );
}
