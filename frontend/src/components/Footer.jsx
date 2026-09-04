import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              <i className="fas fa-store mr-2 text-primary-400"></i>ShopHub
            </h3>
            <p className="text-sm leading-relaxed">Your one-stop destination for the best products at the best prices. Shop from top brands across India with fast delivery and secure payments.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/products" className="block hover:text-primary-400">All Products</Link>
              <Link to="/products?sort=newest" className="block hover:text-primary-400">New Arrivals</Link>
              <Link to="/products?sort=price_asc" className="block hover:text-primary-400">Deals of the Day</Link>
              <Link to="/my-orders" className="block hover:text-primary-400">My Orders</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <div className="space-y-2 text-sm">
              <p><i className="fas fa-phone mr-2"></i>1800-123-4567</p>
              <p><i className="fas fa-envelope mr-2"></i>support@shophub.in</p>
              <p><i className="fas fa-clock mr-2"></i>Mon-Sat: 9AM - 9PM</p>
              <p><i className="fas fa-map-marker-alt mr-2"></i>Mumbai, Maharashtra, India</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-2xl hover:text-primary-400"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-2xl hover:text-primary-400"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-2xl hover:text-primary-400"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-2xl hover:text-primary-400"><i className="fab fa-youtube"></i></a>
            </div>
            <p className="text-sm">Download our app</p>
            <div className="flex space-x-2 mt-2">
              <button className="bg-gray-700 px-3 py-1 rounded text-xs"><i className="fab fa-google-play mr-1"></i>Google Play</button>
              <button className="bg-gray-700 px-3 py-1 rounded text-xs"><i className="fab fa-apple mr-1"></i>App Store</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 ShopHub. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <span className="hover:text-primary-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-primary-400 cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
