import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_URL = 'http://localhost:5000';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/api/orders`, { headers: { Authorization: token } }),
        axios.get(`${API_URL}/api/products`)
      ]);

      const orders = ordersRes.data;
      const totalRevenue = orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((acc, o) => acc + o.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: productsRes.data.length,
        pendingOrders: orders.filter(o => o.status === 'Pending').length,
        deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'Cancelled').length
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const statusColors = {
    'Pending': '#ffa500',
    'Processing': '#6c63ff',
    'Shipped': '#00bcd4',
    'Delivered': '#00c864',
    'Cancelled': '#ff4444'
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* STATS GRID */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card gold">
            <div className="stat-icon">💰</div>
            <div>
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">🛍️</div>
            <div>
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{stats.deliveredOrders}</h3>
              <p>Delivered</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon">❌</div>
            <div>
              <h3>{stats.cancelledOrders}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="admin-quick-actions">
          <Link to="/admin/products" className="quick-action-card">
            <span>🛍️</span>
            <h3>Manage Products</h3>
            <p>Add, edit or delete products</p>
          </Link>
          <Link to="/admin/orders" className="quick-action-card">
            <span>📦</span>
            <h3>Manage Orders</h3>
            <p>View and update order status</p>
          </Link>
        </div>

        {/* RECENT ORDERS */}
        <div className="admin-recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="see-all">See All →</Link>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div className="empty-state">No orders yet!</div>
          ) : (
            <div className="admin-orders-table">
              <div className="table-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {recentOrders.map(order => (
                <div key={order._id} className="table-row">
                  <span>#{order._id.slice(-8).toUpperCase()}</span>
                  <span>{order.user?.name || 'Unknown'}</span>
                  <span>₹{order.totalPrice?.toLocaleString()}</span>
                  <span style={{
                    color: statusColors[order.status],
                    background: `${statusColors[order.status]}22`,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    {order.status}
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
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

export default AdminDashboard;