import express from 'express';
import Testimonial from '../models/Testimonial.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, avatar, rating, quote, product } = req.body || {};
    if (!name || !rating || !quote) {
      return res.status(400).json({ message: 'Name, rating, and quote are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const testimonial = await Testimonial.create({
      name,
      avatar,
      rating,
      quote,
      product,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const update = req.body || {};
    if (update.rating !== undefined && (update.rating < 1 || update.rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

