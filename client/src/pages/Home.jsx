import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ChefHat, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import TestimonialSlider from '../components/TestimonialSlider';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const whyUsFeatures = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Locally sourced dairy and premium toppings daily',
  },
  {
    icon: ChefHat,
    title: 'Handmade Daily',
    description: 'Each cheesecake crafted with care and passion',
  },
  {
    icon: Clock,
    title: 'Same Day Pickup',
    description: 'Order today, pickup today at your convenience',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, testimonialsRes] = await Promise.all([
          fetch(`${API_BASE}/products/featured`),
          fetch(`${API_BASE}/products/categories`),
          fetch(`${API_BASE}/testimonials`),
        ]);

        const [products, cats, reviews] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          testimonialsRes.json(),
        ]);

        setFeaturedProducts(products);
        setCategories(cats);
        setTestimonials(reviews.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-dark-chocolate/70 via-dark-chocolate/50 to-dark-chocolate/80" />
        </div>

        <div className="relative z-10 container-custom text-center text-white py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Handcrafted Cheesecakes
              <br />
              <span className="text-caramel">Made With Love</span>
            </h1>
            <p className="font-accent text-lg md:text-xl text-off-white/80 max-w-2xl mx-auto mb-8 italic">
              Indulge in our award-winning recipes, made fresh daily with premium
              ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/order" className="btn-primary inline-flex items-center gap-2 text-lg">
                Order Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-dark-chocolate">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              Shop By Category
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              From bite-sized poppers to full celebration cakes, we have
              something for every craving
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                category={cat.id}
                count={cat.count}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              Charlie's Favorites
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              Our most beloved cheesecakes, hand-picked by our founder
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-cream rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/favorites" className="btn-secondary inline-flex items-center gap-2">
              View All Favorites
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-caramel/10 via-cream to-strawberry/10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              Why Choose Us
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              Quality and care in every bite since 2010
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUsFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-caramel/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-caramel" />
                </div>
                <h3 className="font-display text-xl font-semibold text-dark-chocolate mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-chocolate/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              What Our Customers Say
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              Real reviews from real cheesecake lovers
            </p>
          </motion.div>

          <TestimonialSlider testimonials={testimonials} />

          <div className="text-center mt-10">
            <Link to="/testimonials" className="btn-secondary">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-chocolate text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Ready to Indulge?
            </h2>
            <p className="text-off-white/70 mb-8 max-w-lg mx-auto">
              Order your favorite cheesecake today and pick it up fresh from our
              bakery
            </p>
            <Link to="/order" className="btn-primary inline-flex items-center gap-2">
              Start Your Order
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
