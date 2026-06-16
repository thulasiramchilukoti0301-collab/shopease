import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const shippingPrice = cartTotal > 999 ? 0 : 99;
  const totalWithShipping = cartTotal + shippingPrice;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      }));

      const res = await axios.post(`${API_URL}/api/orders`, {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        totalPrice: totalWithShipping,
        shippingPrice
      }, {
        headers: { Authorization: token }
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders`);
    } catch (error) {
      toast.error('Failed to place order!');
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>

        {/* STEPS */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span> Address
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span> Payment
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span> Review
          </div>
        </div>

        <div className="checkout-grid">
          <div className="checkout-left">
            {/* STEP 1 - ADDRESS */}
            {step === 1 && (
              <div className="checkout-card">
                <h2>📍 Delivery Address</h2>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    placeholder="House no, Street, Area"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                </div>
                <button className="btn-gold" onClick={() => setStep(2)}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2 - PAYMENT */}
            {step === 2 && (
              <div className="checkout-card">
                <h2>💳 Payment Method</h2>
                <div className="payment-options">
                  {['Cash on Delivery', 'UPI', 'Credit/Debit Card', 'Net Banking'].map(method => (
                    <div
                      key={method}
                      className={`payment-option ${paymentMethod === method ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <div className="radio">{paymentMethod === method ? '🔵' : '⚪'}</div>
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-btns">
                  <button className="btn-outline-gold" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-gold" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* STEP 3 - REVIEW */}
            {step === 3 && (
              <div className="checkout-card">
                <h2>📋 Review Order</h2>
                <div className="review-address">
                  <h3>Delivery Address</h3>
                  <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div className="review-payment">
                  <h3>Payment Method</h3>
                  <p>{paymentMethod}</p>
                </div>
                <div className="review-items">
                  <h3>Order Items ({cart.length})</h3>
                  {cart.map(item => (
                    <div key={item._id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>₹{item.price} × {item.quantity}</p>
                      </div>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-btns">
                  <button className="btn-outline-gold" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn-gold"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {cart.map(item => (
              <div key={item._id} className="summary-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: shippingPrice === 0 ? '#00c864' : '#fff' }}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalWithShipping.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;