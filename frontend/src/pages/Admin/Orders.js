import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: token }
      });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch orders!');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status }, {
        headers: { Authorization: token }
      });
      toast.success(`Order status updated to ${status}! ✅`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status!');
    }
  };

  const statusColors = {
    'Pending': '#ffa500',
    'Processing': '#6c63ff',
    'Shipped': '#00bcd4',
    'Delivered': '#00c864',
    'Cancelled': '#ff4444'
  };

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>📦 Manage Orders</h1>
          <span className="orders-count">{orders.length} total orders</span>
        </div>

        {/* FILTER TABS */}
        <div className="filter-tabs">
          {statuses.map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status} ({status === 'All' ? orders.length : orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">No orders found!</div>
        ) : (
          <div className="admin-orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className="admin-order-card">
                <div className="admin-order-header">
                  <div>
                    <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="admin-order-customer">
                    <p>👤 {order.user?.name || 'Unknown'}</p>
                    <p>📧 {order.user?.email || 'Unknown'}</p>
                  </div>
                  <div className="order-status-badge" style={{
                    background: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}44`
                  }}>
                    {order.status}
                  </div>
                  <p className="admin-order-total">₹{order.totalPrice?.toLocaleString()}</p>
                </div>

                <div className="admin-order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="admin-order-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-order-footer">
                  <div className="order-address-info">
                    <p>📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                    <p>💳 {order.paymentMethod}</p>
                  </div>
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <div className="status-update-btns">
                      <p>Update Status:</p>
                      {['Processing', 'Shipped', 'Delivered'].map(status => (
                        order.status !== status && (
                          <button
                            key={status}
                            className="status-update-btn"
                            style={{ borderColor: statusColors[status], color: statusColors[status] }}
                            onClick={() => handleStatusUpdate(order._id, status)}
                          >
                            {status}
                          </button>
                        )
                      ))}
                    </div>
                  )}
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

export default AdminOrders;