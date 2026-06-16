import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Shop<span>Ease</span></Link>

      <form className="nav-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="nav-links">
        <Link to="/products" className="nav-link">Products</Link>
        {user && <Link to="/orders" className="nav-link">Orders</Link>}
        {user && <Link to="/wishlist" className="nav-link">Wishlist</Link>}
        {user?.role === 'admin' && <Link to="/admin" className="nav-link admin-link">Admin</Link>}
      </div>

      <div className="nav-actions">
        <Link to="/cart" className="cart-btn">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            </button>
            {menuOpen && (
              <div className="dropdown">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
                )}
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
    </nav>
  );
}

export default Navbar;