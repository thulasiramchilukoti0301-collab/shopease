import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://shopease-backend-60vn.onrender.com';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to ShopEase, ${res.data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Shop<span>Ease</span></h1>
        <p>Your premium shopping destination</p>
        <div className="auth-features">
          <div className="auth-feature">✨ Thousands of products</div>
          <div className="auth-feature">🚀 Fast delivery</div>
          <div className="auth-feature">🔒 Secure payments</div>
          <div className="auth-feature">💎 Premium quality</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join ShopEase today</p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            className="btn-auth"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;