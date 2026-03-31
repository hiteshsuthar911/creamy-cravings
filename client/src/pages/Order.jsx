import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const categories = [
  { id: 'poppers', name: 'Poppers', description: 'Bite-sized' },
  { id: 'bambinos', name: 'Bambinos', description: 'Mini cakes' },
  { id: '9inch', name: '9" Cakes', description: 'Full size' },
  { id: 'special', name: 'Special', description: 'Custom orders' },
  { id: 'seasonal', name: 'Seasonal', description: 'Limited time' },
];

const flavors = ['All', 'Classic', 'Chocolate', 'Strawberry', 'Mango', 'Caramel', 'Vanilla', 'Coconut'];

const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

export default function Order() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { pickupDate, setPickupDate, pickupTime, setPickupTime } = useCart();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('All');
  const [priceUpperBound, setPriceUpperBound] = useState(100);
  const [maxPrice, setMaxPrice] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();

        const highestPrice = data.reduce(
          (max, p) => Math.max(max, Number(p.price) || 0),
          0
        );
        const nextPriceUpperBound = Math.max(100, Math.ceil(highestPrice));

        setPriceUpperBound(nextPriceUpperBound);
        setMaxPrice(nextPriceUpperBound);
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
    let filtered = products;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (selectedFlavor !== 'All') {
      filtered = filtered.filter((p) =>
        (p.flavors || []).some((f) => f.toLowerCase().includes(selectedFlavor.toLowerCase()))
      );
    }

    filtered = filtered.filter((p) => Number(p.price) <= maxPrice);

    setFilteredProducts(filtered);
  }, [activeCategory, selectedFlavor, maxPrice, products]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const resetFilters = () => {
    setSelectedFlavor('All');
    setMaxPrice(priceUpperBound);
  };

  return (
    <div className="pt-24">
      <section className="bg-gradient-to-b from-caramel/10 to-cream pb-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-chocolate mb-4">
              Order for Pickup
            </h1>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              Select your favorites and pick them up fresh from our bakery
            </p>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-20 z-40 bg-cream/95 backdrop-blur-md border-b border-caramel/20">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex gap-2 flex-1 min-w-0">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === 'all'
                    ? 'bg-caramel text-white'
                    : 'bg-white text-dark-chocolate hover:bg-caramel/10'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-caramel text-white'
                      : 'bg-white text-dark-chocolate hover:bg-caramel/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                showFilters ? 'bg-caramel text-white' : 'bg-white text-dark-chocolate'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Filters</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-2">
                      Flavor
                    </label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-caramel/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    >
                      {flavors.map((flavor) => (
                        <option key={flavor} value={flavor}>
                          {flavor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-2">
                      Max Price: ${maxPrice}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={priceUpperBound}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-caramel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-white border border-caramel/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-caramel/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-caramel hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Reset filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-chocolate/60">
              {loading ? 'Loading...' : `${filteredProducts.length} products`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-chocolate/60 text-lg mb-4">
                No cheesecakes match your filters.
              </p>
              <button onClick={resetFilters} className="btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
