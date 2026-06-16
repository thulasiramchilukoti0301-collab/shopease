import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingPrice = cartTotal > 999 ? 0 : 99;
  const totalWithShipping = cartTotal + shippingPrice;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-gold">Start Shopping 🛍️</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Shopping Cart <span>({cart.length} items)</span></h1>
        <div className="cart-grid">
          {/* CART ITEMS */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
                </div>
              </div>
            ))}
            <button className="btn-clear-cart" onClick={clearCart}>🗑️ Clear Cart</button>
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: shippingPrice === 0 ? '#00c864' : '#fff' }}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            {shippingPrice > 0 && (
              <p className="free-shipping-msg">
                Add ₹{(999 - cartTotal).toLocaleString()} more for FREE shipping!
              </p>
            )}
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalWithShipping.toLocaleString()}</span>
            </div>
            <button
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn-continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;