import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminNav from '../components/admin/AdminNav';
import RequireAdmin from '../components/admin/RequireAdmin';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function AdminTestimonials() {
  return (
    <RequireAdmin>
      <AdminTestimonialsInner />
    </RequireAdmin>
  );
}

function AdminTestimonialsInner() {
  const token = localStorage.getItem('creamy-cravings-admin-token');

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    avatar: '',
    rating: 5,
    quote: '',
    product: '',
  });

  const authHeaders = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/testimonials`, {
        headers: authHeaders,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to load testimonials');
      }
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      setError(err?.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name || '',
      avatar: t.avatar || '',
      rating: t.rating ?? 5,
      quote: t.quote || '',
      product: t.product || '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      avatar: '',
      rating: 5,
      quote: '',
      product: '',
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this testimonial?');
    if (!ok) return;

    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete testimonial');
      }
      await fetchTestimonials();
    } catch (err) {
      setError(err?.message || 'Failed to delete testimonial');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      rating: Number(form.rating),
    };

    try {
      const res = await fetch(
        editingId
          ? `${API_BASE}/admin/testimonials/${editingId}`
          : `${API_BASE}/admin/testimonials`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save testimonial');
      }

      resetForm();
      await fetchTestimonials();
    } catch (err) {
      setError(err?.message || 'Failed to save testimonial');
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-chocolate">
            Admin - Testimonials
          </h1>
          <p className="text-dark-chocolate/60 mt-2">
            Manage customer reviews and star ratings.
          </p>
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
                {editingId ? 'Edit testimonial' : 'Add testimonial'}
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
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Avatar URL
                </label>
                <input
                  value={form.avatar}
                  onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  placeholder="https://.../image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Quote
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.quote}
                  onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Product (optional)
                </label>
                <input
                  value={form.product}
                  onChange={(e) => setForm((p) => ({ ...p, product: e.target.value }))}
                  className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                  placeholder="Classic New York"
                />
              </div>

              <button className="btn-primary w-full flex items-center justify-center gap-2" type="submit">
                <Plus className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </form>
          </div>

          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-caramel/20">
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate">
                Review List
              </h2>
            </div>
            {loading ? (
              <div className="p-6 animate-pulse text-dark-chocolate/60">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cream/80">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t) => (
                      <tr key={t._id} className="border-t border-caramel/10">
                        <td className="p-4 font-medium text-dark-chocolate">{t.name}</td>
                        <td className="p-4 text-caramel font-semibold">{t.rating}</td>
                        <td className="p-4 text-dark-chocolate/70">{t.product || '—'}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(t)}
                              className="p-2 rounded-xl border border-caramel/20 hover:bg-caramel/10 transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil className="w-4 h-4 text-dark-chocolate" />
                            </button>
                            <button
                              onClick={() => handleDelete(t._id)}
                              className="p-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {testimonials.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-dark-chocolate/60">
                          No testimonials yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
