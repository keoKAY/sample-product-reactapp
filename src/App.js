import './App.css';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Card from './components/common/Card';

//const API_URL = 'http://localhost:8080/api/v1/products';
const API_URL = '/api/v1/products';

const EMPTY_PRODUCT = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
};

const FORM_FIELDS = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Wireless Headphones', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description of the product' },
  { name: 'price', label: 'Price ($)', type: 'number', placeholder: '0.00', required: true },
  { name: 'imageUrl', label: 'Image URL', type: 'url', placeholder: 'https://…' },
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(API_URL);
      setProducts(Array.isArray(data?.payload) ? data.payload : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Is the API running on localhost:8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openModal = () => {
    setNewProduct(EMPTY_PRODUCT);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (!saving) setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await axios.post(API_URL, newProduct);
      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setFormError('Failed to save the product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3 mb-0">Loading products…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-5 border rounded-4 bg-white">
          <h5 className="mb-2">No products yet</h5>
          <p className="text-muted mb-3">Get started by adding your first product.</p>
          <button className="btn btn-primary" onClick={openModal}>
            + Add Product
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start">
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.imageUrl}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="app-shell min-vh-100">
      <header className="app-hero text-white">
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">Product Catalog</h1>
              <p className="mb-0 opacity-75">Browse all products from our sample API.</p>
            </div>
            <button className="btn btn-light btn-lg fw-semibold shadow-sm" onClick={openModal}>
              + Add New Product
            </button>
          </div>
        </div>
      </header>

      <main className="container py-5">
        {!loading && !error && products.length > 0 && (
          <p className="text-muted small text-uppercase fw-semibold mb-3">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}
        {renderContent()}
      </main>

      {showModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <form className="modal-content border-0 shadow-lg rounded-4" onSubmit={handleAddProduct}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Add Product</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
                </div>

                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2">{formError}</div>}

                  {FORM_FIELDS.map(({ name, label, type, placeholder, required }) => (
                    <div className="mb-3" key={name}>
                      <label htmlFor={name} className="form-label fw-semibold small">
                        {label}
                        {required && <span className="text-danger"> *</span>}
                      </label>
                      {type === 'textarea' ? (
                        <textarea
                          id={name}
                          name={name}
                          rows={3}
                          className="form-control"
                          placeholder={placeholder}
                          value={newProduct[name]}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          id={name}
                          name={name}
                          type={type}
                          className="form-control"
                          placeholder={placeholder}
                          value={newProduct[name]}
                          onChange={handleInputChange}
                          required={required}
                          {...(type === 'number' && { min: 0, step: '0.01' })}
                        />
                      )}
                    </div>
                  ))}

                  {newProduct.imageUrl && (
                    <img
                      src={newProduct.imageUrl}
                      alt="Preview"
                      className="img-thumbnail d-block mx-auto"
                      style={{ maxHeight: 160 }}
                      onError={(e) => (e.target.style.display = 'none')}
                      onLoad={(e) => (e.target.style.display = 'block')}
                    />
                  )}
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                    {saving ? 'Saving…' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default App;
