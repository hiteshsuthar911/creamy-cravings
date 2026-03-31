import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['poppers', 'bambinos', '9inch', 'special', 'seasonal'],
    required: true
  },
  flavors: [{
    type: String
  }],
  image: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    enum: ['most-loved', 'top-rated', 'new', null],
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  calories: {
    type: Number,
    default: 0
  },
  ingredients: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);
