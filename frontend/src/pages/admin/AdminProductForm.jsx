import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api, { getErrorMessage } from "../../api/client";
import Loader from "../../components/Loader";
import { SITE } from "../../config/site";
import "./AdminProductForm.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: SITE.categories[0],
  brand: "",
  stock: "",
  isFeatured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          brand: p.brand || "",
          stock: p.stock,
          isFeatured: p.isFeatured,
        });
        setExistingImages(p.images || []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    const totalCurrent = existingImages.length - removeImageIds.length + newFiles.length;
    const allowed = files.slice(0, Math.max(0, 5 - totalCurrent));
    setNewFiles((prev) => [...prev, ...allowed]);
    setNewPreviews((prev) => [...prev, ...allowed.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleRemoveExisting = (publicId) => {
    setRemoveImageIds((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("stock", form.stock || 0);
      formData.append("isFeatured", form.isFeatured);
      newFiles.forEach((file) => formData.append("images", file));
      removeImageIds.forEach((id) => formData.append("removeImageIds", id));

      if (isEdit) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><Loader label="Loading product..." /></AdminLayout>;

  return (
    <AdminLayout>
      <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>
      <hr className="gold-rule" />

      {error && <div className="alert alert-error">{error}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form-grid">
          <div>
            <div className="field">
              <label htmlFor="name">Product Name *</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="product-form-row">
              <div className="field">
                <label htmlFor="price">Price (GHS) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="product-form-row">
              <div className="field">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" required value={form.category} onChange={handleChange}>
                  {SITE.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="brand">Brand (optional)</label>
                <input id="brand" name="brand" value={form.brand} onChange={handleChange} />
              </div>
            </div>

            <label className="product-form-checkbox">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Feature this product on the homepage
            </label>
          </div>

          <div>
            <div className="field">
              <label>Product Images (up to 5)</label>
              <div className="product-image-grid">
                {existingImages.map((img) => (
                  <div
                    key={img.publicId}
                    className={`product-image-tile ${removeImageIds.includes(img.publicId) ? "is-removed" : ""}`}
                  >
                    <img src={img.url} alt="" />
                    <button
                      type="button"
                      className="product-image-remove"
                      onClick={() => toggleRemoveExisting(img.publicId)}
                    >
                      {removeImageIds.includes(img.publicId) ? "Undo" : "Remove"}
                    </button>
                  </div>
                ))}
                {newPreviews.map((src, idx) => (
                  <div key={src} className="product-image-tile">
                    <img src={src} alt="" />
                    <button type="button" className="product-image-remove" onClick={() => removeNewFile(idx)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" multiple onChange={handleFilesSelected} />
              <p className="product-form-hint">JPG, PNG, or WEBP. Max 5MB each.</p>
            </div>
          </div>
        </div>

        <div className="product-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
