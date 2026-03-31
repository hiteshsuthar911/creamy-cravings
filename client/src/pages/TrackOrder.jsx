import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Calendar, Clock, CheckCircle, Clock3, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const statusSteps = ['pending', 'confirmed', 'ready', 'completed'];

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE}/orders/track/${orderNumber.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found or an error occurred. Please check your order number.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <section className="bg-gradient-to-b from-caramel/10 to-cream pb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-chocolate mb-4">
              Track Your Order
            </h1>
            <p className="text-dark-chocolate/60 mb-8">
              Enter your order number to see the current status of your delicious cheesecakes.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="e.g. ORD-1A2B3C4D"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-caramel/20 rounded-full shadow-sm text-dark-chocolate focus:outline-none focus:ring-2 focus:ring-caramel pl-14"
              />
              <Search className="w-5 h-5 text-caramel absolute left-5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-6"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center justify-center gap-2 text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-200"
              >
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container-custom mt-8 md:mt-12">
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-lg border border-caramel/10 overflow-hidden">
                <div className="bg-caramel/5 p-6 md:p-8 border-b border-caramel/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-caramel tracking-wider uppercase">
                        Order Status
                      </p>
                      <h2 className="font-display text-2xl font-bold text-dark-chocolate mt-1">
                        {order.orderNumber}
                      </h2>
                    </div>
                    {isCancelled ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
                        <X className="w-5 h-5" /> Cancelled
                      </div>
                    ) : (
                      <Link
                        to={`/invoice/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        View Invoice
                      </Link>
                    )}
                  </div>
                </div>

                {!isCancelled && (
                  <div className="p-6 md:p-8 border-b border-caramel/10">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-caramel/20 -translate-y-1/2 hidden md:block"></div>
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-caramel -translate-y-1/2 hidden md:block transition-all duration-500"
                        style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
                      ></div>

                      <div className="flex flex-col md:flex-row justify-between relative space-y-6 md:space-y-0">
                        {statusSteps.map((step, index) => {
                          const isActive = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;

                          return (
                            <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 relative z-10 w-full md:w-1/4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors ${
                                  isActive
                                    ? 'bg-caramel border-white text-white shadow-md'
                                    : 'bg-white border-cream text-caramel/40'
                                }`}
                              >
                                {isActive ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <Clock3 className="w-5 h-5" />
                                )}
                              </div>
                              <div className="text-left md:text-center">
                                <p
                                  className={`font-semibold capitalize ${
                                    isActive ? 'text-dark-chocolate' : 'text-dark-chocolate/40'
                                  }`}
                                >
                                  {step}
                                </p>
                                {isCurrent && (
                                  <p className="text-xs text-caramel mt-1 hidden md:block">
                                    Current Status
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-dark-chocolate mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-caramel" /> Pickup Details
                    </h3>
                    <div className="bg-cream/50 rounded-2xl p-5 space-y-4">
                      <div>
                        <p className="text-sm text-dark-chocolate/60 mb-1">Date</p>
                        <p className="font-medium text-dark-chocolate">
                          {new Date(order.pickupDate).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-dark-chocolate/60 mb-1">Time</p>
                        <p className="font-medium text-dark-chocolate">{order.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-dark-chocolate/60 mb-1">Customer</p>
                        <p className="font-medium text-dark-chocolate">{order.customerName}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-dark-chocolate mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-caramel" /> Order Items
                    </h3>
                    <div className="space-y-4">
                      {(order.items || []).map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between border-b border-caramel/10 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 m-auto text-caramel/40 mt-3" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-dark-chocolate">
                                {item.product?.name || 'Unknown Product'}
                              </p>
                              <p className="text-sm text-dark-chocolate/60">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-caramel">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-caramel/20 flex justify-between items-center text-lg font-bold text-dark-chocolate">
                        <span>Total:</span>
                        <span>${(order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
