import { motion } from 'framer-motion';

const terms = [
  {
    title: 'Use of Website',
    body:
      'By using this website, you agree to use it only for lawful purposes and in a way that does not infringe the rights of others.',
  },
  {
    title: 'Orders and Pickup',
    body:
      'All orders are subject to availability and confirmation. Pickup times are estimates and may vary during high-demand periods.',
  },
  {
    title: 'Pricing and Payments',
    body:
      'Prices shown on the website are in local currency and may change without notice. We reserve the right to correct pricing errors.',
  },
  {
    title: 'Cancellations and Refunds',
    body:
      'Cancellation and refund eligibility depends on preparation status and product type. Please contact support as early as possible for changes.',
  },
  {
    title: 'Intellectual Property',
    body:
      'All site content, branding, graphics, and copy are owned by Creamy Cravings or used with permission. Unauthorized use is prohibited.',
  },
  {
    title: 'Limitation of Liability',
    body:
      'To the maximum extent allowed by law, Creamy Cravings is not liable for indirect, incidental, or consequential damages arising from website use.',
  },
  {
    title: 'Changes to Terms',
    body:
      'We may update these terms at any time. Continued use of the website after changes means you accept the revised terms.',
  },
];

export default function TermsOfService() {
  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-dark-chocolate to-dark-chocolate/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-off-white/80 text-lg">Effective date: 31 March 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-caramel/20 rounded-2xl p-6 md:p-8 space-y-6"
          >
            <p className="text-dark-chocolate/75">
              These Terms of Service govern your use of Creamy Cravings website and services. Please read them carefully before placing an order.
            </p>

            {terms.map((term) => (
              <div key={term.title}>
                <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-2">{term.title}</h2>
                <p className="text-dark-chocolate/75 leading-relaxed">{term.body}</p>
              </div>
            ))}

            <div>
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-2">Contact</h2>
              <p className="text-dark-chocolate/75 leading-relaxed">
                For terms-related questions, contact us at support@creamycravings.com.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
