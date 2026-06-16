import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function Products() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest'
  });
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'All';
    setFilters(prev => ({ ...prev, search, category }));
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await axios.get(`${API_URL}/api/products?${params}`);
      setProducts(res.data);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: token }
      });
      setWishlist(res.data.wishlist || []);
    } catch (error) {
      console.log('Error fetching wishlist');
    }
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Beauty', 'Gaming'];

  return (
    <div className="products-page">
      <Navbar />
      <div className="products-container">
        {/* SIDEBAR FILTERS */}
        <aside className="filters-sidebar">
          <h3>🔍 Filters</h3>

          <div className="filter-group">
            <label>Category</label>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-cat-btn ${filters.category === cat ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button
            className="btn-clear-filters"
            onClick={() => setFilters({ search: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest' })}
          >
            Clear Filters
          </button>
        </aside>

        {/* PRODUCTS AREA */}
        <div className="products-main">
          <div className="products-header">
            <h2>
              {filters.category !== 'All' ? filters.category : 'All Products'}
              {filters.search && ` - "${filters.search}"`}
            </h2>
            <span className="products-count">{products.length} products found</span>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>😕 No products found!</p>
              <p>Try different filters or search terms</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlist={wishlist}
                  onWishlistUpdate={setWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Products;