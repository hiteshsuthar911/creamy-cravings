import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, avatar, rating, quote, product } = req.body;
    
    if (!name || !rating || !quote) {
      return res.status(400).json({ message: 'Name, rating, and quote are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const testimonial = new Testimonial({
      name,
      avatar,
      rating,
      quote,
      product
    });
    
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
