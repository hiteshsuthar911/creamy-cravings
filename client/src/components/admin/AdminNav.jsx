import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function AdminNav() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('creamy-cravings-admin-token');
    navigate('/admin/login');
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-caramel/10 text-dark-chocolate hover:bg-caramel/20 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/admin/testimonials"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-caramel/10 text-dark-chocolate hover:bg-caramel/20 transition-colors"
          >
            Testimonials
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-caramel/10 text-dark-chocolate hover:bg-caramel/20 transition-colors"
          >
            Orders
          </Link>
          <Link
            to="/admin/favorites"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-caramel/10 text-dark-chocolate hover:bg-caramel/20 transition-colors"
          >
            Favorites
          </Link>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-dark-chocolate hover:bg-caramel/20 border border-caramel/20 transition-colors"
          aria-label="Admin logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

