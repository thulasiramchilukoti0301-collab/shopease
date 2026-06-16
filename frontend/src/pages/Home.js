import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featured, all] = await Promise.all([
        axios.get(`${API_URL}/api/products/featured`),
        axios.get(`${API_URL}/api/products`)
      ]);
      setFeaturedProducts(featured.data);
      setAllProducts(all.data.slice(0, 8));
    } catch (error) {
      console.log('Error fetching products:', error);
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
      console.log('Error fetching wishlist:', error);
    }
  };

  const categories = [
    { name: 'Electronics', emoji: '📱', color: '#6c63ff' },
    { name: 'Fashion', emoji: '👕', color: '#f50057' },
    { name: 'Books', emoji: '📚', color: '#00c864' },
    { name: 'Home & Kitchen', emoji: '🏠', color: '#ffa500' },
    { name: 'Beauty', emoji: '💄', color: '#ff69b4' },
    { name: 'Gaming', emoji: '🎮', color: '#C9A84C' },
  ];

  return (
    <div className="home">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">✨ New Arrivals 2026</div>
          <h1>Shop <span>Premium</span> Products at <span>Best Prices</span></h1>
          <p>Discover thousands of products across all categories. Fast delivery, secure payments, premium quality.</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={() => navigate('/products')}>Shop Now 🛍️</button>
            <button className="btn-outline-gold" onClick={() => navigate('/products?category=Electronics')}>View Deals ⚡</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>10K+</span><p>Products</p></div>
            <div className="hero-stat"><span>50K+</span><p>Customers</p></div>
            <div className="hero-stat"><span>4.8★</span><p>Rating</p></div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-circle">
            <span className="hero-emoji">🛍️</span>
          </div>
          <div className="floating-card card1">📱 Electronics</div>
          <div className="floating-card card2">👕 Fashion</div>
          <div className="floating-card card3">⚡ Best Deals</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by <span>Category</span></h2>
          <Link to="/products" className="see-all">See All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="category-card"
              style={{ borderColor: `${cat.color}44` }}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="products-section">
          <div className="section-header">
            <h2>⭐ Featured <span>Products</span></h2>
            <Link to="/products" className="see-all">See All →</Link>
          </div>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlist={wishlist}
                  onWishlistUpdate={setWishlist}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ALL PRODUCTS */}
      <section className="products-section">
        <div className="section-header">
          <h2>🔥 Latest <span>Products</span></h2>
          <Link to="/products" className="see-all">See All →</Link>
        </div>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : allProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products yet! Admin will add products soon.</p>
          </div>
        ) : (
          <div className="products-grid">
            {allProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                wishlist={wishlist}
                onWishlistUpdate={setWishlist}
              />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES BANNER */}
      <section className="features-banner">
        <div className="feature-item">
          <span>🚀</span>
          <h3>Fast Delivery</h3>
          <p>Get your orders delivered within 2-3 days</p>
        </div>
        <div className="feature-item">
          <span>🔒</span>
          <h3>Secure Payment</h3>
          <p>100% secure and encrypted payments</p>
        </div>
        <div className="feature-item">
          <span>↩️</span>
          <h3>Easy Returns</h3>
          <p>30 day hassle-free return policy</p>
        </div>
        <div className="feature-item">
          <span>💎</span>
          <h3>Premium Quality</h3>
          <p>Only the best quality products</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;