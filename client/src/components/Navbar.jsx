import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: "Charlie's Favorites", path: '/favorites' },
  { name: 'Order', path: '/order' },
  { name: 'Track Order', path: '/track-order' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const saved = localStorage.getItem('creamy-cravings-theme');
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const next = saved === 'dark' || (!saved && prefersDark);
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('creamy-cravings-theme', next ? 'dark' : 'light');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 dark:bg-dark-chocolate/95 backdrop-blur-md shadow-md border-b border-caramel/20'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🍰</span>
              <div>
                <h1 className="font-display text-xl font-semibold text-dark-chocolate dark:text-off-white leading-tight">
                  Creamy Cravings
                </h1>
                <p className="text-xs text-chocolate/70 dark:text-off-white/70 font-accent italic">
                  Cheesecake Works
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-caramel ${
                    location.pathname === link.path
                      ? 'text-caramel'
                      : 'text-dark-chocolate dark:text-off-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-full text-dark-chocolate dark:text-off-white hover:bg-caramel/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-dark-chocolate dark:text-off-white hover:text-caramel transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-caramel text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-dark-chocolate dark:text-off-white"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-cream dark:bg-dark-chocolate border-t border-caramel/20"
            >
              <div className="container-custom py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-caramel/20 text-caramel'
                        : 'text-dark-chocolate dark:text-off-white hover:bg-caramel/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartSidebar />
    </>
  );
}
