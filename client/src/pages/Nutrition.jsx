import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function formatIngredients(ingredients) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return '—';
  return ingredients.join(', ');
}

export default function Nutrition() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFlavor, setActiveFlavor] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products?available=true`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products for nutrition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    for (const p of products) map.set(p.category, p.category);
    return ['All', ...Array.from(map.keys())];
  }, [products]);

  const flavors = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      for (const f of p.flavors || []) {
        map.set(f, f);
      }
    }
    return ['All', ...Array.from(map.keys())];
  }, [products]);

  const filtered = useMemo(() => {
    let out = products;
    if (activeCategory !== 'All') {
      out = out.filter((p) => p.category === activeCategory);
    }
    if (activeFlavor !== 'All') {
      const needle = activeFlavor.toLowerCase();
      out = out.filter((p) => (p.flavors || []).some((f) => f.toLowerCase() === needle));
    }
    return out;
  }, [products, activeCategory, activeFlavor]);

  return (
    <div className="pt-24">
      <section className="relative pt-16 pb-10 bg-gradient-to-b from-caramel/20 to-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full border border-caramel/20">
              <FlaskConical className="w-5 h-5 text-caramel" />
              <p className="text-sm font-medium text-dark-chocolate">
                Nutrition & Ingredients
              </p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-chocolate mt-5">
              Calories, Ingredients, and All the Good Stuff
            </h1>
            <p className="text-dark-chocolate/60 mt-3 max-w-2xl mx-auto">
              Every cheesecake is crafted with premium ingredients. Explore calories and ingredient lists for each flavor.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-chocolate mb-2">
                Flavor
              </label>
              <select
                value={activeFlavor}
                onChange={(e) => setActiveFlavor(e.target.value)}
                className="w-full md:max-w-xs px-4 py-3 bg-white border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
              >
                {flavors.map((f) => (
                  <option key={f} value={f}>
                    {f === 'All' ? 'All Flavors' : f}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-chocolate mb-2">
                Category
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full md:max-w-xs px-4 py-3 bg-white border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-chocolate/60 text-lg">
                No nutrition details match your filters.
              </p>
              <button
                onClick={() => {
                  setActiveFlavor('All');
                  setActiveCategory('All');
                }}
                className="mt-6 btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <motion.article
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card bg-white"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-44 object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur-sm border border-caramel/20 px-3 py-1 rounded-full">
                      <p className="text-sm font-semibold text-dark-chocolate">
                        {p.calories ? `${p.calories} cal` : 'Calories N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-dark-chocolate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-dark-chocolate/60 mt-1">
                      Category: <span className="font-medium">{p.category}</span>
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-dark-chocolate">Ingredients</p>
                      <p className="text-sm text-dark-chocolate/60 mt-1">
                        {formatIngredients(p.ingredients)}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
