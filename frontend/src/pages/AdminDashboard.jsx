import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', description: '', price: '', discountPrice: '', image: '', category: '', brand: '', stock: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordersRes, catRes] = await Promise.all([
        axios.get('/api/orders/stats').catch(() => ({ data: {} })),
        axios.get('/api/products/admin/all'),
        axios.get('/api/orders/admin/all'),
        axios.get('/api/categories')
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setOrders(ordersRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const toggleActive = async (product) => {
    try {
      const { data } = await axios.put(`/api/products/${product._id}`, { isActive: !product.isActive });
      setProducts(products.map(p => p._id === product._id ? data : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating product');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, slug: product.slug, description: product.description,
        price: product.price, discountPrice: product.discountPrice || '',
        image: product.image || '', category: product.category?._id || '',
        brand: product.brand || '', stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', slug: '', description: '', price: '', discountPrice: '', image: '', category: '', brand: '', stock: '' });
    }
    setShowProductModal(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : 0,
        stock: Number(productForm.stock)
      };
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { orderStatus: status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: data.orderStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  const statusColors = {
    placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-indigo-100 text-indigo-700',
    processing: 'bg-yellow-100 text-yellow-700', shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700'
  };

  if (loading) return <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-3xl text-primary-500"></i></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-cog mr-2 text-primary-500"></i>Admin Dashboard
        </h1>
      </div>

      <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
          { id: 'products', label: 'Products', icon: 'fas fa-box' },
          { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-bag' }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${tab === t.id ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <i className={t.icon}></i><span>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-rupee-sign text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-shopping-bag text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-clock text-yellow-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-box text-primary-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 font-medium">Order ID</th>
                    <th className="py-2 font-medium">Customer</th>
                    <th className="py-2 font-medium">Amount</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono text-xs">{order._id.slice(-8)}</td>
                      <td className="py-2">{order.user?.name}</td>
                      <td className="py-2 font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td>
                      <td className="py-2 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">All Products ({products.length})</h2>
            <button onClick={() => openProductModal()} className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              <i className="fas fa-plus mr-1"></i>Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium">Price</th>
                  <th className="py-2 font-medium">Stock</th>
                  <th className="py-2 font-medium">Rating</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <img src={product.image} className="w-10 h-10 object-contain rounded border" alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">{product.category?.name || '-'}</td>
                    <td className="py-2">
                      <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.discountPrice > 0 && <span className="text-green-600 text-xs ml-1">→ ₹{product.discountPrice.toLocaleString('en-IN')}</span>}
                    </td>
                    <td className="py-2"><span className={product.stock < 10 ? 'text-red-500 font-semibold' : ''}>{product.stock}</span></td>
                    <td className="py-2"><span className="text-yellow-500"><i className="fas fa-star text-xs mr-1"></i>{product.rating}</span></td>
                    <td className="py-2">
                      <button onClick={() => toggleActive(product)} className={`px-2 py-1 rounded text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <button onClick={() => openProductModal(product)} className="text-blue-500 hover:text-blue-600" title="Edit"><i className="fas fa-edit"></i></button>
                        <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-600" title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">All Orders ({orders.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 font-medium">Order ID</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Items</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Payment</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="py-2">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="py-2">{order.items.length} item(s)</td>
                    <td className="py-2 font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2">
                      <span className="uppercase text-xs font-semibold">{order.paymentMethod}</span>
                      <span className={`block text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="py-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td className="py-2 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-2">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs focus:outline-none focus:border-primary-500"
                      >
                        {['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={saveProduct} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows="3" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                  <input type="number" value={productForm.discountPrice} onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded-lg text-sm">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
