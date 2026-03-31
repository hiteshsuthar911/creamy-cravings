import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, FileText } from 'lucide-react';

const legalCards = [
  {
    title: 'Privacy Policy',
    description: 'Learn what data we collect, how we use it, and your privacy rights.',
    icon: ShieldCheck,
    path: '/privacy-policy',
  },
  {
    title: 'Terms of Service',
    description: 'Understand the terms that apply when using our website and placing orders.',
    icon: FileText,
    path: '/terms-of-service',
  },
];

export default function Legal() {
  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-dark-chocolate to-dark-chocolate/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Legal</h1>
            <p className="text-off-white/80 text-lg">
              Clear, simple legal information for using Creamy Cravings services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {legalCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-caramel/20 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-caramel/15 text-caramel flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-2">
                  {card.title}
                </h2>
                <p className="text-dark-chocolate/70 mb-5">{card.description}</p>
                <Link
                  to={card.path}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-caramel text-white hover:bg-chocolate transition-colors"
                >
                  Read {card.title}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-white border border-caramel/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-caramel/15 text-caramel flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl text-dark-chocolate">Need legal support?</h3>
                <p className="text-dark-chocolate/70 mt-1">
                  For legal requests, email us at legal@creamycravings.com and our team will respond within 5 business days.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
