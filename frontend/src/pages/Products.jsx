import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category', selectedCategory);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page);
        params.set('limit', 20);
        const { data } = await axios.get(`/api/products?${params.toString()}`);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [search, selectedCategory, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, selectedCategory, sort]);

  const priceRanges = [
    { label: 'Under ₹500', min: '', max: '500' },
    { label: '₹500 - ₹1,000', min: '500', max: '1000' },
    { label: '₹1,000 - ₹5,000', min: '1000', max: '5000' },
    { label: '₹5,000 - ₹20,000', min: '5000', max: '20000' },
    { label: '₹20,000 - ₹50,000', min: '20000', max: '50000' },
    { label: 'Over ₹50,000', min: '50000', max: '' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4 text-sm text-gray-500">
        {search && <span>Showing results for "<strong>{search}</strong>" - </span>}
        <span>{total} products found</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                className={`block w-full text-left text-sm py-1 px-2 rounded ${!selectedCategory ? 'bg-primary-50 text-primary-600 font-semibold' : 'hover:bg-gray-50'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                  className={`block w-full text-left text-sm py-1 px-2 rounded ${selectedCategory === cat._id ? 'bg-primary-50 text-primary-600 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMinPrice(range.min); setMaxPrice(range.max); setPage(1); }}
                  className={`block w-full text-left text-sm py-1 px-2 rounded ${minPrice === range.min && maxPrice === range.max ? 'bg-primary-50 text-primary-600 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  {range.label}
                </button>
              ))}
              <button
                onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(1); }}
                className="block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-50 text-gray-500"
              >
                Clear Price
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">Custom Price</h3>
            <div className="flex items-center space-x-2 mb-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
              <span>-</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <button onClick={() => setPage(1)} className="w-full bg-primary-500 text-white text-sm py-1 rounded hover:bg-primary-600">Apply</button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <form onSubmit={(e) => { e.preventDefault(); setSearch(e.target.querySelector('input').value); setPage(1); }} className="flex-1 w-full md:max-w-md">
              <div className="flex">
                <input type="text" defaultValue={search} placeholder="Search products..." className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary-500" />
                <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-r text-sm hover:bg-primary-600">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-3xl text-primary-500"></i>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500 text-lg">No products found</p>
              <button onClick={() => { setSearch(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); }} className="mt-3 text-primary-600 hover:underline">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {total > 20 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-gray-50">Prev</button>
                  <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 20)}</span>
                  <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
