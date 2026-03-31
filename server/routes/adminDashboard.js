import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.use(adminAuth);

router.get('/summary', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalProducts,
      featuredProducts,
      availableProducts,
      totalTestimonials,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
      pickupsToday,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ available: true }),
      Testimonial.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'ready' }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ pickupDate: { $gte: todayStart, $lte: todayEnd } }),
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'ready', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .populate('items.product', 'name price')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    res.json({
      products: {
        total: totalProducts,
        featured: featuredProducts,
        available: availableProducts,
      },
      testimonials: {
        total: totalTestimonials,
      },
      orders: {
        total: totalOrders,
        byStatus: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          ready: readyOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        pickupsToday,
      },
      revenue: {
        activeOrderRevenue: Number(revenueResult?.[0]?.total || 0),
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
