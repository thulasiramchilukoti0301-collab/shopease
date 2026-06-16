import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:5000';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: token }
      });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch orders!');
    }
    setLoading(false);
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: token }
      });
      toast.success('Order cancelled successfully!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order!');
    }
  };

  const statusColors = {
    'Pending': '#ffa500',
    'Processing': '#6c63ff',
    'Shipped': '#00bcd4',
    'Delivered': '#00c864',
    'Cancelled': '#ff4444'
  };

  const statusEmojis = {
    'Pending': '⏳',
    'Processing': '⚙️',
    'Shipped': '🚚',
    'Delivered': '✅',
    'Cancelled': '❌'
  };

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>📦 No orders yet!</p>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status" style={{
                    background: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}44`
                  }}>
                    {statusEmojis[order.status]} {order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address">
                    <p>📍 {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                    <p>💳 {order.paymentMethod}</p>
                  </div>
                  <div className="order-total-section">
                    <p className="order-total">₹{order.totalPrice?.toLocaleString()}</p>
                    {(order.status === 'Pending' || order.status === 'Processing') && (
                      <button
                        className="btn-cancel-order"
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;