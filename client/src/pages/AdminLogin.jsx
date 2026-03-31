import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('creamy-cravings-admin-token');
    if (token) navigate('/admin/products', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('creamy-cravings-admin-token', data.token);
      navigate('/admin/products', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <h1 className="font-display text-4xl font-bold text-dark-chocolate mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-dark-chocolate/60 text-center mb-8">
            Sign in to manage products, testimonials, and pickup orders.
          </p>

          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-caramel/20 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-caramel" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    type="email"
                    placeholder="admin@creamycravings.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-chocolate mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-caramel" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full btn-primary flex items-center justify-center disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
