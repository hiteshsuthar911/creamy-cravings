import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-caramel/20 to-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-chocolate mb-4">
              What Our Customers Say
            </h1>
            <p className="text-dark-chocolate/70 text-lg">
              Real reviews from real cheesecake lovers who have experienced our
              handcrafted creations
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                <span className="font-display text-5xl font-bold text-caramel">
                  {averageRating}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-dark-chocolate/60">
                Based on {testimonials.length} reviews
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-chocolate/60 text-lg">
                No testimonials yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Quote className="w-10 h-10 text-caramel/30 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-dark-chocolate/80 mb-4 font-accent italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-caramel/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-caramel/20 flex items-center justify-center">
                          <span className="font-display font-semibold text-caramel">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-dark-chocolate">
                          {testimonial.name}
                        </p>
                        {testimonial.product && (
                          <p className="text-sm text-dark-chocolate/50">
                            on {testimonial.product}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {testimonials.length > 3 && (
                <div className="flex justify-center gap-4 mt-12">
                  <button
                    onClick={goToPrev}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-dark-chocolate" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-dark-chocolate" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-strawberry/20 to-caramel/20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-dark-chocolate mb-4">
              Share Your Experience
            </h2>
            <p className="text-dark-chocolate/60 mb-6">
              Had a great experience with our cheesecakes? We'd love to hear
              from you!
            </p>
            <a
              href="mailto:reviews@creamycravings.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              Leave a Review
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
