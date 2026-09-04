import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        const { data: revData } = await axios.get(`/api/reviews/product/${id}`);
        setReviews(revData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.product === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        image: product.image,
        quantity,
        stock: product.stock
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setReviewMsg('Added to cart!');
    setTimeout(() => setReviewMsg(''), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', { product: id, rating, comment });
      const { data } = await axios.get(`/api/reviews/product/${id}`);
      setReviews(data);
      setComment('');
      setRating(5);
      setReviewMsg('Review submitted!');
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error submitting review');
      setTimeout(() => setReviewMsg(''), 3000);
    }
  };

  if (loading) return <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-3xl text-primary-500"></i></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="border rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-80 md:h-96 object-contain p-4" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }} />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex space-x-2 mt-3 overflow-x-auto">
                <img src={product.image} className="w-16 h-16 object-cover border-2 border-primary-500 rounded cursor-pointer" alt="" />
                {product.gallery.map((img, idx) => (
                  <img key={idx} src={img} className="w-16 h-16 object-cover border rounded cursor-pointer hover:border-primary-500" alt="" />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            {product.brand && <p className="text-sm text-gray-500 mb-2">Brand: <span className="text-primary-600">{product.brand}</span></p>}

            <div className="flex items-center space-x-3 mb-3">
              <div className="flex text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map(i => (
                  <i key={i} className={i <= Math.round(product.rating) ? 'fas fa-star' : 'far fa-star'}></i>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            <div className="border-t border-b py-3 mb-4">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-green-600 font-semibold">{discount}% off</span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  <i className="fas fa-tag mr-1"></i>You save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium">Category:</span>
              <Link to={`/products?category=${product.category?._id}`} className="text-sm text-primary-600 hover:underline">{product.category?.name}</Link>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm font-medium">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-sm text-green-600"><i className="fas fa-check-circle mr-1"></i>In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-sm text-red-500"><i className="fas fa-times-circle mr-1"></i>Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100">
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="px-4 py-2 text-center min-w-[50px] font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100">
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>
                <span className="text-sm text-gray-500">{product.stock} in stock</span>
              </div>
            )}

            <div className="flex space-x-3">
              {product.stock > 0 && (
                <button onClick={addToCart} className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition">
                  <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                </button>
              )}
              {product.stock > 0 && (
                <Link to="/cart" onClick={addToCart} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg text-center transition">
                  <i className="fas fa-bolt mr-2"></i>Buy Now
                </Link>
              )}
            </div>

            {reviewMsg && (
              <div className={`mt-3 text-sm font-medium ${reviewMsg.includes('cart') ? 'text-green-600' : reviewMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                {reviewMsg}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews ({reviews.length})</h2>

          {user ? (
            <form onSubmit={submitReview} className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Write a Review</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm">Rating:</span>
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} type="button" onClick={() => setRating(i)} className="text-xl">
                    <i className={i <= rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'}></i>
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                rows="3"
              />
              <button type="submit" className="mt-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded transition">
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              <Link to="/login" className="text-primary-600 hover:underline">Login</Link> to write a review.
            </p>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">{review.user?.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-sm">{review.user?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex text-yellow-400 text-xs mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <i key={i} className={i <= review.rating ? 'fas fa-star' : 'far fa-star'}></i>
                    ))}
                  </div>
                  {review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
