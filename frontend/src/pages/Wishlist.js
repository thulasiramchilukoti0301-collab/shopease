import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: token }
      });
      setWishlist(res.data.wishlist || []);

      if (res.data.wishlist && res.data.wishlist.length > 0) {
        const productPromises = res.data.wishlist.map(id =>
          axios.get(`${API_URL}/api/products/${id}`)
        );
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.map(p => p.data));
      }
    } catch (error) {
      toast.error('Failed to fetch wishlist!');
    }
    setLoading(false);
  };

  const handleWishlistUpdate = (newWishlist) => {
    setWishlist(newWishlist);
    setWishlistProducts(prev => prev.filter(p => newWishlist.includes(p._id)));
  };

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist-container">
        <h1>My Wishlist ❤️</h1>
        {wishlistProducts.length === 0 ? (
          <div className="empty-state">
            <p>💔 Your wishlist is empty!</p>
            <p>Save items you love to your wishlist</p>
            <Link to="/products" className="btn-gold">Explore Products 🛍️</Link>
          </div>
        ) : (
          <>
            <p className="wishlist-count">{wishlistProducts.length} items in your wishlist</p>
            <div className="products-grid">
              {wishlistProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlist={wishlist}
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;