import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: "Charlie's Favorites", path: '/favorites' },
    { name: 'Order for Pickup', path: '/order' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Contact', path: '/contact' },
  ],
  legal: [
    { name: 'Legal', path: '/legal' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-chocolate text-off-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍰</span>
              <div>
                <h3 className="font-display text-xl font-semibold text-off-white">
                  Creamy Cravings
                </h3>
                <p className="text-sm text-off-white/60 font-accent italic">
                  Cheesecake Works
                </p>
              </div>
            </div>
            <p className="text-off-white/70 mb-6 max-w-md">
              Handcrafting the finest cheesecakes since 2010. Made fresh daily
              with locally sourced ingredients and lots of love.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-off-white/10 rounded-full hover:bg-caramel transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-off-white/10 rounded-full hover:bg-caramel transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-off-white/10 rounded-full hover:bg-caramel transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-off-white/70 hover:text-caramel transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-off-white/70 hover:text-caramel transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-off-white/10 mt-12 pt-8 text-center text-off-white/50 text-sm">
          <p>© {new Date().getFullYear()} Creamy Cravings Cheesecake Works. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
