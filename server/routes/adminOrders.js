import express from 'express';
import Order from '../models/Order.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

async function ensureReadableCodes(order) {
  if (!order) return order;

  let changed = false;
  const idSuffix = String(order._id).slice(-8).toUpperCase();

  if (!order.orderNumber) {
    order.orderNumber = `ORD-${idSuffix}`;
    changed = true;
  }

  if (!order.invoiceNumber) {
    order.invoiceNumber = `INV-${idSuffix}`;
    changed = true;
  }

  if (!order.invoiceGeneratedAt) {
    order.invoiceGeneratedAt = order.createdAt || new Date();
    changed = true;
  }

  if (changed) {
    await order.save();
  }

  return order;
}

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });

    await Promise.all(orders.map((order) => ensureReadableCodes(order)));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['pending', 'confirmed', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    await ensureReadableCodes(order);
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

