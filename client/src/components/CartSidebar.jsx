import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Calendar,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const timeSlots = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

export default function CartSidebar() {
  const {
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    notes,
    setNotes,
    resetCheckout,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const todayStr = useMemo(
    () => new Date().toISOString().split('T')[0],
    []
  );

  const validate = () => {
    const errs = {};
    if (!pickupDate) errs.pickupDate = 'Pickup date is required.';
    if (!pickupTime) errs.pickupTime = 'Pickup time is required.';
    if (!customerName.trim()) errs.customerName = 'Name is required.';
    if (!customerPhone.trim()) errs.customerPhone = 'Phone is required.';
    return errs;
  };

  const [formErrors, setFormErrors] = useState({});

  const placeOrder = async () => {
    setSubmitError('');
    setConfirmation(null);

    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          customizations: {},
        })),
        pickupDate,
        pickupTime,
        customerName,
        customerPhone,
        customerEmail,
        notes,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to place order');
      }

      const order = await res.json();
      setConfirmation(order);
    } catch (error) {
      setSubmitError(error?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // If an order was placed, finalize the cart reset when the user dismisses the sidebar.
    if (confirmation) {
      clearCart();
      resetCheckout();
      setConfirmation(null);
    }
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-dark-chocolate/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream dark:bg-dark-chocolate z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-caramel/20">
              <h2 className="font-display text-xl font-semibold text-dark-chocolate dark:text-off-white">
                Your Cart
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-caramel/10 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-dark-chocolate dark:text-off-white" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-caramel/40 mb-4" />
                <h3 className="font-display text-lg text-dark-chocolate dark:text-off-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-dark-chocolate/60 dark:text-off-white/70 mb-6">
                  Discover our delicious cheesecakes and add them to your cart
                </p>
                <Link
                  to="/order"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 bg-white rounded-xl p-3 shadow-sm"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-dark-chocolate dark:text-off-white truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-caramel font-semibold">
                            ${item.product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 hover:bg-caramel/10 rounded transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 hover:bg-caramel/10 rounded transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-caramel/20 p-6 space-y-4 bg-white dark:bg-white/5">
                  {confirmation ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-caramel/10 rounded-xl border border-caramel/20">
                        <p className="font-display text-lg font-semibold text-dark-chocolate dark:text-off-white">
                          Order placed successfully!
                        </p>
                        <p className="text-dark-chocolate/60 dark:text-off-white/70 mt-1 mb-4">
                          We are preparing your order. Pickup is{' '}
                          {confirmation?.pickupDate
                            ? new Date(confirmation.pickupDate).toLocaleDateString()
                            : 'soon'}{' '}
                          at {confirmation?.pickupTime || 'selected time'}.
                        </p>
                        {confirmation?.orderNumber && (
                          <div className="mt-2 p-3 bg-white dark:bg-white/10 rounded-lg text-center border border-caramel/20">
                            <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-1">Your Order Number</p>
                            <p className="font-display text-xl font-bold text-dark-chocolate dark:text-off-white">
                              {confirmation.orderNumber}
                            </p>
                          </div>
                        )}
                        {confirmation?._id && (
                          <div className="mt-4 flex flex-col gap-2">
                            <Link 
                              to={`/track-order`}
                              onClick={handleClose} 
                              className="btn-secondary w-full text-center flex items-center justify-center py-2"
                            >
                              Track Order
                            </Link>
                            <Link 
                              to={`/invoice/${confirmation._id}`} 
                              target="_blank"
                              onClick={handleClose}
                              className="w-full py-2 text-center text-sm font-semibold text-caramel hover:underline"
                            >
                              View/Print Invoice
                            </Link>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleClose}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-dark-chocolate/70 dark:text-off-white/70">
                          Subtotal
                        </span>
                        <span className="font-display text-xl font-semibold text-dark-chocolate dark:text-off-white">
                      ${cartTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Pickup Date *
                          </label>
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={todayStr}
                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 ${
                              formErrors.pickupDate
                                ? 'border-red-500'
                                : 'border-caramel/20'
                            }`}
                          />
                          {formErrors.pickupDate && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.pickupDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Pickup Time *
                          </label>
                          <select
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 ${
                              formErrors.pickupTime
                                ? 'border-red-500'
                                : 'border-caramel/20'
                            }`}
                          >
                            <option value="">Select time</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {formErrors.pickupTime && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.pickupTime}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className={`w-full px-4 py-3 bg-cream border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 ${
                              formErrors.customerName
                                ? 'border-red-500'
                                : 'border-caramel/20'
                            }`}
                            placeholder="Your name"
                          />
                          {formErrors.customerName && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.customerName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className={`w-full px-4 py-3 bg-cream border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 ${
                              formErrors.customerPhone
                                ? 'border-red-500'
                                : 'border-caramel/20'
                            }`}
                            placeholder="Phone number"
                          />
                          {formErrors.customerPhone && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.customerPhone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            Email (optional)
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                            placeholder="your@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-dark-chocolate mb-1 dark:text-off-white/80">
                            Notes (optional)
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 bg-cream border border-caramel/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50 resize-none"
                            placeholder="Anything we should know?"
                          />
                        </div>
                      </div>

                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                          {submitError}
                        </div>
                      )}

                      <button
                        onClick={placeOrder}
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>Placing...</span>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" />
                            Place Order
                          </>
                        )}
                      </button>

                      <button
                        onClick={clearCart}
                        className="w-full text-sm text-dark-chocolate/60 dark:text-off-white/70 hover:text-red-500 transition-colors"
                      >
                        Clear Cart
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
