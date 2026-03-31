import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const badgeFilters = [
  { id: null, label: 'All Favorites', icon: null },
  { id: 'most-loved', label: 'Most Loved', icon: Flame },
  { id: 'top-rated', label: 'Top Rated', icon: Star },
  { id: 'new', label: 'New Arrivals', icon: Sparkles },
];

export default function Favorites() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeBadge, setActiveBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/featured`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeBadge === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.badge === activeBadge));
    }
  }, [activeBadge, products]);

  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-caramel/20 to-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-5xl mb-4 block">🍰</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-chocolate mb-4">
              Charlie's Favorites
            </h1>
            <p className="text-dark-chocolate/70 text-lg">
              Our most beloved cheesecakes, hand-picked by our founder. These
              are the creations that have won hearts and become customer
              favorites over the years.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {badgeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id ?? 'all'}
                  onClick={() => setActiveBadge(filter.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                    activeBadge === filter.id
                      ? 'bg-caramel text-white shadow-lg'
                      : 'bg-white text-dark-chocolate hover:bg-caramel/10'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {filter.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-chocolate/60 text-lg">
                No products found with this filter.
              </p>
              <button
                onClick={() => setActiveBadge(null)}
                className="mt-4 text-caramel hover:underline"
              >
                View all favorites
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-strawberry/20 to-caramel/20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
          >
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-dark-chocolate mb-4">
                Looking for something special?
              </h2>
              <p className="text-dark-chocolate/60 mb-6">
                We also offer custom cake orders! Tell us your vision and we'll
                create a personalized cheesecake masterpiece just for you.
              </p>
              <a
                href="/order?category=special"
                className="btn-primary inline-flex items-center gap-2"
              >
                Order Custom Cake
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
