import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

function ProductCard({ product, wishlist, onWishlistUpdate }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/products/${product._id}/wishlist`, {}, {
        headers: { Authorization: token }
      });
      onWishlistUpdate && onWishlistUpdate(res.data.wishlist);
      const isWishlisted = res.data.wishlist.includes(product._id);
      toast.success(isWishlisted ? '❤️ Added to wishlist!' : '💔 Removed from wishlist!');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const isWishlisted = wishlist && wishlist.includes(product._id);
  const discount = product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        {product.featured && <span className="featured-badge">⭐ Featured</span>}
        <button className="wishlist-btn" onClick={handleWishlist}>
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-card-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">{renderStars(product.ratings)}</span>
          <span className="rating-count">({product.numReviews})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > 0 && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {product.stock === 0 ? (
          <button className="btn-out-of-stock" disabled>Out of Stock</button>
        ) : (
          <button className="btn-add-cart" onClick={handleAddToCart}>Add to Cart 🛒</button>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;