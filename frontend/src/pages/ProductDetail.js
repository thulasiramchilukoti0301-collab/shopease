import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Product not found!');
      navigate('/products');
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.log('Error fetching reviews');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit a review!');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a comment!');
      return;
    }
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/reviews/${id}`, reviewForm, {
        headers: { Authorization: token }
      });
      toast.success('Review submitted successfully! ⭐');
      fetchReviews();
      fetchProduct();
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
    setSubmittingReview(false);
  };

  const renderStars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  const discount = product?.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) return <div className="loading-page">Loading...</div>;
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        <div className="product-detail-grid">
          {/* LEFT - IMAGE */}
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            {discount > 0 && <span className="discount-badge-large">{discount}% OFF</span>}
          </div>

          {/* RIGHT - INFO */}
          <div className="product-detail-info">
            <span className="product-detail-category">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="product-detail-rating">
              <span className="stars-large">{renderStars(product.ratings)}</span>
              <span>({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="price-large">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > 0 && (
                <>
                  <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="price-discount">{discount}% off</span>
                </>
              )}
            </div>

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-meta">
              <div className="meta-item">
                <span>Brand:</span> <strong>{product.brand || 'Generic'}</strong>
              </div>
              <div className="meta-item">
                <span>Stock:</span>
                <strong style={{ color: product.stock > 0 ? '#00c864' : '#ff4444' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </strong>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            )}

            <div className="product-detail-btns">
              {product.stock > 0 ? (
                <>
                  <button className="btn-gold-large" onClick={handleAddToCart}>🛒 Add to Cart</button>
                  <button className="btn-outline-gold-large" onClick={handleBuyNow}>⚡ Buy Now</button>
                </>
              ) : (
                <button className="btn-out-of-stock-large" disabled>Out of Stock</button>
              )}
            </div>

            <div className="product-tags">
              {product.tags?.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {/* ADD REVIEW */}
          {user && (
            <div className="add-review">
              <h3>Write a Review</h3>
              <div className="star-select">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >★</button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows="4"
              />
              <button
                className="btn-gold"
                onClick={handleReviewSubmit}
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review ⭐'}
              </button>
            </div>
          )}

          {/* REVIEWS LIST */}
          {reviews.length === 0 ? (
            <div className="no-reviews">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <p className="reviewer-name">{review.name}</p>
                      <span className="review-stars">{renderStars(review.rating)}</span>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;