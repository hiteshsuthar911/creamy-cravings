import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Information We Collect',
    body:
      'We collect information you provide directly to us, such as your name, phone number, email address, and order details when placing pickup orders.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'We use your information to process orders, communicate pickup details, improve our services, and send updates when you have requested them.',
  },
  {
    title: 'Data Sharing',
    body:
      'We do not sell personal data. We may share information with service providers that support payments, communications, analytics, or hosting under confidentiality obligations.',
  },
  {
    title: 'Data Retention',
    body:
      'We retain order and contact data for as long as needed to provide services, meet legal requirements, and resolve support requests.',
  },
  {
    title: 'Your Rights',
    body:
      'You may request access, correction, or deletion of your personal information by contacting privacy@creamycravings.com.',
  },
  {
    title: 'Policy Updates',
    body:
      'We may update this policy from time to time. Material changes will be reflected by an updated effective date on this page.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-dark-chocolate to-dark-chocolate/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
              This Privacy Policy describes how Creamy Cravings collects, uses, and protects your personal information when you use our website and place orders.
            </p>

            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-2">{section.title}</h2>
                <p className="text-dark-chocolate/75 leading-relaxed">{section.body}</p>
              </div>
            ))}

            <div>
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-2">Contact</h2>
              <p className="text-dark-chocolate/75 leading-relaxed">
                For privacy-related questions, contact us at privacy@creamycravings.com.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
