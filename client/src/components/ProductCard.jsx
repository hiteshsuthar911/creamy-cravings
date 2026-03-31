import { motion } from 'framer-motion';
import { Plus, Check, Flame, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const badgeConfig = {
  'most-loved': { icon: Flame, label: 'Most Loved', bg: 'bg-orange-500' },
  'top-rated': { icon: Star, label: 'Top Rated', bg: 'bg-amber-500' },
  new: { icon: Star, label: 'New', bg: 'bg-green-500' },
};

export default function ProductCard({ product, index = 0 }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {badge && (
          <div
            className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1`}
          >
            {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
            {badge.label}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-dark-chocolate/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.flavors.slice(0, 2).map((flavor) => (
            <span
              key={flavor}
              className="text-xs bg-strawberry/20 text-chocolate px-2 py-0.5 rounded-full"
            >
              {flavor}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-semibold text-dark-chocolate mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-dark-chocolate/60 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-accent text-xl text-caramel font-semibold">
            ${product.price.toFixed(2)}
          </span>

          <motion.button
            onClick={handleAddToCart}
            disabled={!product.available}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isAdded
                ? 'bg-green-500 text-white'
                : product.available
                ? 'bg-caramel text-dark-chocolate hover:bg-caramel/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
