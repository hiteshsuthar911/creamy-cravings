import { useEffect, useState, useMemo } from 'react';
import { Star, StarOff } from 'lucide-react';
import AdminNav from '../components/admin/AdminNav';
import RequireAdmin from '../components/admin/RequireAdmin';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function AdminFavorites() {
  return (
    <RequireAdmin>
      <AdminFavoritesInner />
    </RequireAdmin>
  );
}

function AdminFavoritesInner() {
  const token = localStorage.getItem('creamy-cravings-admin-token');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

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
      const res = await fetch(`${API_BASE}/admin/products`, { headers: authHeaders });
      if (!res.ok) {
        throw new Error('Failed to load products');
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

  const toggleFavorite = async (product) => {
    setUpdatingId(product._id);
    setError('');

    try {
      const newFeaturedStatus = !product.featured;
      const res = await fetch(`${API_BASE}/admin/products/${product._id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ featured: newFeaturedStatus }),
      });
      if (!res.ok) {
        throw new Error('Failed to update favorite status');
      }
      
      const updatedProduct = await res.json();
      setProducts((prev) => 
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    } catch (err) {
      setError(err?.message || 'Failed to update favorite status');
    } finally {
      setUpdatingId(null);
    }
  };

  const favoritesCount = products.filter(p => p.featured).length;

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-chocolate">
            Admin - Charlie's Favorites
          </h1>
          <p className="text-dark-chocolate/60 mt-2">
            Manage the "Charlie's Favorites" public listing. Currently {favoritesCount} favorites.
          </p>
        </div>

        <AdminNav />

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl p-6 animate-pulse">
            Loading products...
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl overflow-hidden p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {products.map(product => (
                 <div key={product._id} className={`border rounded-xl p-4 transition-all ${product.featured ? 'border-caramel bg-caramel/5 shadow-md' : 'border-caramel/20 bg-white'}`}>
                   <img src={product.image} className="w-full h-40 object-cover rounded-lg mb-3" alt={product.name} />
                   <h3 className="font-display font-semibold text-dark-chocolate text-lg whitespace-nowrap overflow-hidden text-ellipsis mb-1">{product.name}</h3>
                   <p className="font-accent text-caramel text-lg font-semibold mb-3">${product.price.toFixed(2)}</p>
                   
                   <button 
                      onClick={() => toggleFavorite(product)}
                      disabled={updatingId === product._id}
                      className={`w-full flex justify-center items-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                        product.featured 
                        ? 'bg-caramel text-white hover:bg-caramel/90' 
                        : 'bg-white border text-dark-chocolate/60 hover:bg-caramel/10'
                      }`}
                   >
                     {updatingId === product._id ? (
                       <span>Updating...</span>
                     ) : product.featured ? (
                       <><Star className="w-4 h-4 fill-white" /> Featured</>
                     ) : (
                       <><StarOff className="w-4 h-4" /> Not Featured</>
                     )}
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
