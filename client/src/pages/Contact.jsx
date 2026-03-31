import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '(555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@creamycravings.com',
    link: 'mailto:hello@creamycravings.com',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '123 Baker Street, Brooklyn, NY 11201',
    link: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: 'Mon-Sat: 8AM-7PM, Sun: 10AM-5PM',
    link: null,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-dark-chocolate to-dark-chocolate/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-off-white/80 text-lg">
              Have questions or want to place a custom order? We'd love to hear
              from you!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-6">
                Contact Information
              </h2>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl"
                  >
                    <div className="p-3 bg-caramel/10 rounded-lg">
                      <info.icon className="w-5 h-5 text-caramel" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark-chocolate">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-dark-chocolate/60 hover:text-caramel transition-colors"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-dark-chocolate/60">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <div className="mt-8 rounded-xl overflow-hidden h-64 bg-gray-200">
                <iframe
                  title="Bakery Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.4!2d-73.99!3d40.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQxJzI0LjAiTiA3M8KwNTknMjQuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-dark-chocolate mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-dark-chocolate/60">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-caramel hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-cream border rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel/50 transition-all ${
                        errors.name
                          ? 'border-red-500 animate-[shake_0.3s_ease-in-out]'
                          : 'border-caramel/20'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-cream border rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel/50 transition-all ${
                        errors.email
                          ? 'border-red-500 animate-[shake_0.3s_ease-in-out]'
                          : 'border-caramel/20'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel/50 transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-chocolate mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 bg-cream border rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel/50 transition-all resize-none ${
                        errors.message
                          ? 'border-red-500 animate-[shake_0.3s_ease-in-out]'
                          : 'border-caramel/20'
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-dark-chocolate/30 border-t-dark-chocolate rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
