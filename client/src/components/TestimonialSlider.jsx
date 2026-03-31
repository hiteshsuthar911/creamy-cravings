import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSlider({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <img
              src={current.avatar}
              alt={current.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-caramel/20"
            />
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(current.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <blockquote className="font-accent text-xl italic text-dark-chocolate mb-4">
              "{current.quote}"
            </blockquote>
            <cite className="not-italic">
              <span className="font-display font-semibold text-dark-chocolate">
                {current.name}
              </span>
              {current.product && (
                <span className="text-dark-chocolate/60 text-sm block mt-1">
                  on {current.product}
                </span>
              )}
            </cite>
          </motion.div>
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-dark-chocolate" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-dark-chocolate" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-caramel w-6'
                    : 'bg-caramel/30 hover:bg-caramel/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
