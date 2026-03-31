import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cookie, Cake, PartyPopper, Sparkles, Gift } from 'lucide-react';

const categoryConfig = {
  poppers: {
    icon: PartyPopper,
    name: 'Poppers',
    description: 'Bite-sized delights',
    color: 'bg-caramel/20',
    hoverColor: 'hover:bg-caramel/30',
  },
  bambinos: {
    icon: Cookie,
    name: 'Bambinos',
    description: 'Perfect portions',
    color: 'bg-strawberry/20',
    hoverColor: 'hover:bg-strawberry/30',
  },
  '9inch': {
    icon: Cake,
    name: '9" Cakes',
    description: 'Full-size cakes',
    color: 'bg-chocolate/20',
    hoverColor: 'hover:bg-chocolate/30',
  },
  special: {
    icon: Gift,
    name: 'Special Orders',
    description: 'Custom creations',
    color: 'bg-amber-100',
    hoverColor: 'hover:bg-amber-200',
  },
  seasonal: {
    icon: Sparkles,
    name: 'Seasonal',
    description: 'Limited flavors',
    color: 'bg-green-100',
    hoverColor: 'hover:bg-green-200',
  },
};

export default function CategoryCard({ category, count, index = 0 }) {
  const config = categoryConfig[category] || categoryConfig.poppers;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/order?category=${category}`}
        className={`block p-6 rounded-2xl ${config.color} ${config.hoverColor} transition-all duration-300 group hover:-translate-y-1`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
            <Icon className="w-8 h-8 text-caramel" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-dark-chocolate">
              {config.name}
            </h3>
            <p className="text-sm text-dark-chocolate/60">{config.description}</p>
          </div>
          <span className="text-sm font-medium text-dark-chocolate/50">
            {count} items
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
