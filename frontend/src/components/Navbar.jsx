import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    window.addEventListener('cartUpdated', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenu(false);
    navigate('/');
  };

  return (
    <header>
      <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
              <i className="fas fa-store text-white"></i>
              <span>ShopHub</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none"
                />
                <button type="submit" className="px-5 py-2 bg-primary-500 hover:bg-primary-700 rounded-r-md">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="hidden md:flex items-center space-x-5">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="hover:text-primary-200 text-sm font-medium">
                      <i className="fas fa-cog mr-1"></i>Admin
                    </Link>
                  )}
                  <Link to="/my-orders" className="hover:text-primary-200 text-sm font-medium">
                    <i className="fas fa-box mr-1"></i>Orders
                  </Link>
                  <Link to="/cart" className="relative hover:text-primary-200">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-sm font-medium hover:text-primary-200">
                      <i className="fas fa-user"></i>
                      <span>{user.name.split(' ')[0]}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                      <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/cart" className="relative hover:text-primary-200">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/login" className="hover:text-primary-200 text-sm font-medium">Login</Link>
                  <Link to="/register" className="bg-white text-primary-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100">Register</Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-xl">
              <i className={mobileMenu ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-primary-700 px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 bg-white rounded-l-md text-sm"
                />
                <button type="submit" className="px-3 bg-primary-500 rounded-r-md">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
            <div className="space-y-2">
              <Link to="/products" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">All Products</Link>
              <Link to="/cart" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              {user ? (
                <>
                  <Link to="/my-orders" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="block py-2 hover:text-primary-200">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-primary-200">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
