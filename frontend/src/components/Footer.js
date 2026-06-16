import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Shop<span>Ease</span></h2>
          <p>Your one-stop destination for all your shopping needs. Quality products at the best prices.</p>
          <div className="footer-socials">
            <a href="#" className="social-link">📘 Facebook</a>
            <a href="#" className="social-link">📸 Instagram</a>
            <a href="#" className="social-link">🐦 Twitter</a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div className="footer-links">
          <h3>Categories</h3>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Fashion">Fashion</Link>
          <Link to="/products?category=Books">Books</Link>
          <Link to="/products?category=Home & Kitchen">Home & Kitchen</Link>
          <Link to="/products?category=Beauty">Beauty</Link>
          <Link to="/products?category=Gaming">Gaming</Link>
        </div>

        <div className="footer-links">
          <h3>Support</h3>
          <a href="#">Help Center</a>
          <a href="#">Track Order</a>
          <a href="#">Returns</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ShopEase. All rights reserved. Made with ❤️ by Thulasiram Chilukoti</p>
        <div className="payment-icons">
          <span>💳 Credit Card</span>
          <span>📱 UPI</span>
          <span>🏦 Net Banking</span>
          <span>💵 COD</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;