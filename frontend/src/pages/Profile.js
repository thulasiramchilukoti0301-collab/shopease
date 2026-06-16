import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: { street: '', city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: token }
      });
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        address: res.data.address || { street: '', city: '', state: '', pincode: '' }
      });
    } catch (error) {
      toast.error('Failed to fetch profile!');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/auth/profile`, formData, {
        headers: { Authorization: token }
      });
      setProfile(res.data);
      updateUser({ ...user, name: res.data.name });
      toast.success('Profile updated successfully! ✅');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile!');
    }
  };

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{profile?.name}</h1>
            <p>{profile?.email}</p>
            <span className="role-badge">{profile?.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}</span>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Personal Information</h2>
              <button
                className="btn-edit-profile"
                onClick={() => setEditing(!editing)}
              >
                {editing ? '✕ Cancel' : '✏️ Edit'}
              </button>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="profile-value">{profile?.name}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <p className="profile-value">{profile?.email}</p>
            </div>

            <div className="form-group">
              <label>Member Since</label>
              <p className="profile-value">
                {new Date(profile?.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>

            {editing && (
              <button className="btn-gold" onClick={handleUpdate}>
                Save Changes ✅
              </button>
            )}
          </div>

          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Delivery Address</h2>
            </div>

            <div className="form-group">
              <label>Street</label>
              {editing ? (
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                />
              ) : (
                <p className="profile-value">{profile?.address?.street || 'Not set'}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                {editing ? (
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                  />
                ) : (
                  <p className="profile-value">{profile?.address?.city || 'Not set'}</p>
                )}
              </div>
              <div className="form-group">
                <label>State</label>
                {editing ? (
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                  />
                ) : (
                  <p className="profile-value">{profile?.address?.state || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              {editing ? (
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, pincode: e.target.value }
                  })}
                />
              ) : (
                <p className="profile-value">{profile?.address?.pincode || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
