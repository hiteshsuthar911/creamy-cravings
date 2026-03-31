import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, flavor, minPrice, maxPrice, featured, available } = req.query;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (flavor) {
      filter.flavors = { $in: [new RegExp(flavor, 'i')] };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, available: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const categoryMap = {
      poppers: { name: 'Poppers', description: 'Bite-sized cheesecake delights' },
      bambinos: { name: 'Bambinos', description: 'Mini cheesecakes, perfect portions' },
      '9inch': { name: '9" Cakes', description: 'Full-size celebration cakes' },
      special: { name: 'Special Orders', description: 'Custom creations' },
      seasonal: { name: 'Seasonal', description: 'Limited time flavors' }
    };
    
    const result = categories.map(cat => ({
      ...categoryMap[cat._id],
      id: cat._id,
      count: cat.count
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
