import { motion } from 'framer-motion';

const team = [
  {
    name: 'Charlie Anderson',
    role: 'Founder & Head Baker',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    quote: 'Every cheesecake tells a story of tradition, passion, and the finest ingredients.',
  },
  {
    name: 'Maria Santos',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    quote: 'Baking is like love - it should be entered into with abandon or not at all.',
  },
  {
    name: 'James Chen',
    role: 'Head Chocolatier',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    quote: 'Chocolate is the answer. Who cares what the question is.',
  },
];

const gallery = [
  'https://images.unsplash.com/photo-1556217477-d325251ece38?w=600',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
  'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600',
  'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600',
];

export default function About() {
  return (
    <div>
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-dark-chocolate to-dark-chocolate/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Our Story
            </h1>
            <p className="font-accent text-xl text-off-white/80 italic">
              From a small kitchen to your heart
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-6">
                A Legacy of Sweetness
              </h2>
              <div className="space-y-4 text-dark-chocolate/70">
                <p>
                  In 2010, Charlie Anderson started baking cheesecakes in his
                  small Brooklyn kitchen, driven by a simple dream: to create the
                  most delicious, creamy cheesecake anyone had ever tasted.
                </p>
                <p>
                  What began as gifts for friends and family quickly became a
                  beloved local sensation. Word spread about these incredible
                  cheesecakes, and soon the demand was too great to ignore.
                </p>
                <p>
                  Today, Creamy Cravings stands as a testament to Charlie's
                  commitment to quality. Every cheesecake is still made from
                  scratch, using the same recipes perfected over a decade of
                  passion and experimentation.
                </p>
                <p>
                  We source only the finest ingredients: farm-fresh cream cheese,
                  organic eggs, real vanilla beans, and premium Belgian chocolate.
                  No shortcuts, no compromises—just pure, indulgent goodness.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=800"
                alt="Bakery kitchen"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-caramel text-white p-6 rounded-xl shadow-lg">
                <span className="font-display text-4xl font-bold">14+</span>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              Meet Our Team
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              The talented people behind every perfect bite
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream rounded-2xl p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h3 className="font-display text-xl font-semibold text-dark-chocolate">
                  {member.name}
                </h3>
                <p className="text-caramel text-sm mb-3">{member.role}</p>
                <p className="font-accent text-dark-chocolate/70 italic text-sm">
                  "{member.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark-chocolate mb-4">
              Our Kitchen
            </h2>
            <p className="text-dark-chocolate/60 max-w-xl mx-auto">
              Where the magic happens every single day
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Kitchen ${index + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-caramel to-chocolate text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Visit Us Today
            </h2>
            <p className="text-off-white/80 mb-6 max-w-lg mx-auto">
              Experience the aroma of fresh-baked cheesecakes and taste the
              difference of true craftsmanship
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-chocolate font-semibold px-8 py-3 rounded-lg hover:bg-off-white transition-colors"
            >
              Get Directions
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
