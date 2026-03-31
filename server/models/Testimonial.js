import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  quote: {
    type: String,
    required: true
  },
  product: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Testimonial', testimonialSchema);
