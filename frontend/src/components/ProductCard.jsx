import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.product === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 hover:text-primary-600 line-clamp-2 h-10">{product.name}</h3>
        </Link>
        <div className="flex items-center mt-1 mb-1">
          <div className="flex text-yellow-400 text-xs">
            {[1, 2, 3, 4, 5].map(i => (
              <i key={i} className={i <= Math.round(product.rating) ? 'fas fa-star' : i <= product.rating + 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">₹{product.discountPrice > 0 ? product.discountPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}</span>
          {product.discountPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
        {product.brand && <p className="text-xs text-gray-500 mt-1">{product.brand}</p>}
        <button
          onClick={addToCart}
          className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 rounded transition-colors"
        >
          <i className="fas fa-cart-plus mr-1"></i>Add to Cart
        </button>
      </div>
    </div>
  );
}
