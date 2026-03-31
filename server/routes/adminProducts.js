import express from 'express';
import Product from '../models/Product.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      flavors,
      image,
      badge,
      available,
      calories,
      ingredients,
      featured,
    } = req.body || {};

    const product = await Product.create({
      name,
      description,
      price,
      category,
      flavors: Array.isArray(flavors) ? flavors : typeof flavors === 'string' ? flavors.split(',').map((s) => s.trim()).filter(Boolean) : [],
      image,
      badge: badge === null ? null : badge,
      available: available ?? true,
      calories: calories ?? 0,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : typeof ingredients === 'string'
          ? ingredients.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      featured: featured ?? false,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const update = req.body || {};

    // Normalize comma-separated inputs used by the admin UI.
    if (typeof update.flavors === 'string') {
      update.flavors = update.flavors.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof update.ingredients === 'string') {
      update.ingredients = update.ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

