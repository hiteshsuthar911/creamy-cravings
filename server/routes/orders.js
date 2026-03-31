import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

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

function buildInvoicePayload(order) {
  const items = (order.items || []).map((item) => {
    const unitPrice = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return {
      productId: item.product?._id || item.product,
      name: item.product?.name || 'Unknown product',
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  const subtotal = Number(order.total || 0);
  const tax = 0;

  return {
    invoiceNumber: order.invoiceNumber,
    invoiceGeneratedAt: order.invoiceGeneratedAt,
    orderId: order._id,
    orderNumber: order.orderNumber,
    orderCreatedAt: order.createdAt,
    orderStatus: order.status,
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail || '',
    },
    pickup: {
      date: order.pickupDate,
      time: order.pickupTime,
    },
    items,
    notes: order.notes || '',
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

router.post('/', async (req, res) => {
  try {
    const { items, pickupDate, pickupTime, customerName, customerPhone, customerEmail, notes } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        customizations: item.customizations || {}
      });
      total += product.price * item.quantity;
    }
    
    const order = new Order({
      items: orderItems,
      pickupDate: new Date(pickupDate),
      pickupTime,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      total,
      status: 'pending'
    });
    
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate('items.product');
    await ensureReadableCodes(populatedOrder);
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await ensureReadableCodes(order);
    res.json(buildInvoicePayload(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() }).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await ensureReadableCodes(order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
