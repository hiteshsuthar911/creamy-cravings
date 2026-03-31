import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AdminNav from '../components/admin/AdminNav';
import RequireAdmin from '../components/admin/RequireAdmin';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const categoryOptions = ['poppers', 'bambinos', '9inch', 'special', 'seasonal'];
const badgeOptions = ['most-loved', 'top-rated', 'new'];

function toCommaSeparated(arr) {
  if (!Array.isArray(arr)) return '';
  return arr.join(', ');
}

export default function AdminProducts() {
  return (
    <RequireAdmin>
      <AdminProductsInner />
    </RequireAdmin>
  );
}

function AdminProductsInner() {
  const token = localStorage.getItem('creamy-cravings-admin-token');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'poppers',
    flavors: '',
    badge: 'none',
    image: '',
    available: true,
    calories: 0,
    ingredients: '',
    featured: false,
  });

  const authHeaders = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: authHeaders,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to load products');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? 0,
      category: p.category || 'poppers',
      flavors: toCommaSeparated(p.flavors),
      badge: p.badge || 'none',
      image: p.image || '',
      available: p.available ?? true,
      calories: p.calories ?? 0,
      ingredients: toCommaSeparated(p.ingredients),
      featured: p.featured ?? false,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      price: 0,
      category: 'poppers',
      flavors: '',
      badge: 'none',
      image: '',
      available: true,
      calories: 0,
      ingredients: '',
      featured: false,
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete product');
      }
      await fetchProducts();
    } catch (err) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      price: Number(form.price),
      calories: Number(form.calories),
      badge: form.badge === 'none' ? null : form.badge,
      flavors: form.flavors,
      ingredients: form.ingredients,
    };

    try {
      const res = await fetch(
        editingId ? `${API_BASE}/admin/products/${editingId}` : `${API_BASE}/admin/products`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save product');
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err?.message || 'Failed to save product');
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-chocolate">Admin - Products</h1>
          <p className="text-dark-chocolate/60 mt-2">Create, edit, and feature cheesecakes.</p>
        </div>

        <AdminNav />

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate">
                {editingId ? 'Edit product' : 'Add product'}
              </h2>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-caramel/20 hover:bg-caramel/10 transition-colors"
                type="button"
              >
                Clear
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-chocolate mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-chocolate mb-1">Calories</label>
                  <input
                    type="number"
                    required
                    value={form.calories}
                    onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))}
                    className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-chocolate mb-1">Flavors (comma)</label>
                  <input
                    value={form.flavors}
                    onChange={(e) => setForm((p) => ({ ...p, flavors: e.target.value }))}
                    className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    placeholder="Chocolate, Strawberry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-chocolate mb-1">Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  >
                    <option value="none">None</option>
                    {badgeOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">Ingredients (comma)</label>
                <input
                  value={form.ingredients}
                  onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  placeholder="Cream Cheese, Sugar, Eggs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">Image URL</label>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  placeholder="https://.../image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                  />
                  Available
                </label>
                <label className="flex items-center gap-3 px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  />
                  Featured
                </label>
              </div>

              <p className="text-xs text-dark-chocolate/60">
                Home and Favorites pages display only products marked as Featured.
              </p>

              <button className="btn-primary w-full flex items-center justify-center gap-2" type="submit">
                <Plus className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>

          <div>
            {loading ? (
              <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl p-6 animate-pulse">
                Loading products...
              </div>
            ) : (
              <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-caramel/20">
                  <h2 className="font-display text-2xl font-semibold text-dark-chocolate">
                    Product List
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-cream/80">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} className="border-t border-caramel/10">
                          <td className="p-4 font-medium text-dark-chocolate">
                            {p.name}
                          </td>
                          <td className="p-4 text-dark-chocolate/70">{p.category}</td>
                          <td className="p-4 text-caramel font-semibold">${(p.price ?? 0).toFixed(2)}</td>
                          <td className="p-4 text-dark-chocolate/70">{p.featured ? 'Yes' : 'No'}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2 rounded-xl border border-caramel/20 hover:bg-caramel/10 transition-colors"
                                aria-label="Edit"
                              >
                                <Pencil className="w-4 h-4 text-dark-chocolate" />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="p-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-dark-chocolate/60">
                            No products yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
