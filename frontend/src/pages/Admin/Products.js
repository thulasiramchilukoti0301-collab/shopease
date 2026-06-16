import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_URL = 'http://localhost:5000';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: 'Electronics', image: '', stock: '',
    brand: '', featured: false, tags: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to fetch products!');
    }
    setLoading(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || '',
        category: product.category,
        image: product.image,
        stock: product.stock,
        brand: product.brand || '',
        featured: product.featured || false,
        tags: product.tags?.join(', ') || ''
      });
    } else {
      setEditProduct(null);
      setFormData({
        name: '', description: '', price: '', originalPrice: '',
        category: 'Electronics', image: '', stock: '',
        brand: '', featured: false, tags: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.image || !formData.stock) {
      toast.error('Please fill all required fields!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        stock: Number(formData.stock),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      if (editProduct) {
        await axios.put(`${API_URL}/api/products/${editProduct._id}`, data, {
          headers: { Authorization: token }
        });
        toast.success('Product updated successfully! ✅');
      } else {
        await axios.post(`${API_URL}/api/products`, data, {
          headers: { Authorization: token }
        });
        toast.success('Product added successfully! ✅');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token }
      });
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product!');
    }
  };

  const categories = ['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Beauty', 'Gaming'];

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🛍️ Manage Products</h1>
          <button className="btn-gold" onClick={() => handleOpenModal()}>+ Add Product</button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="admin-products-table">
            <div className="table-header">
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Featured</span>
              <span>Actions</span>
            </div>
            {products.map(product => (
              <div key={product._id} className="table-row">
                <span>
                  <img src={product.image} alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </span>
                <span>{product.name}</span>
                <span>{product.category}</span>
                <span>₹{product.price.toLocaleString()}</span>
                <span style={{ color: product.stock > 0 ? '#00c864' : '#ff4444' }}>
                  {product.stock}
                </span>
                <span>{product.featured ? '⭐' : '—'}</span>
                <span className="table-actions">
                  <button className="btn-edit-sm" onClick={() => handleOpenModal(product)}>✏️ Edit</button>
                  <button className="btn-delete-sm" onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal admin-modal">
            <div className="modal-header">
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" placeholder="Product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input type="text" placeholder="Brand name"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows="3" placeholder="Product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" placeholder="Original price (for discount)"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" placeholder="Stock quantity"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL *</label>
                <input type="text" placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  ⭐ Mark as Featured Product
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleSubmit}>
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default AdminProducts;