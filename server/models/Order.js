import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customizations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  orderNumber: {
    type: String,
    trim: true
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  invoiceGeneratedAt: {
    type: Date
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

orderSchema.pre('validate', function assignReadableCodes(next) {
  const idSuffix = String(this._id).slice(-8).toUpperCase();

  if (!this.orderNumber) {
    this.orderNumber = `ORD-${idSuffix}`;
  }

  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${idSuffix}`;
  }

  if (!this.invoiceGeneratedAt) {
    this.invoiceGeneratedAt = new Date();
  }

  next();
});

orderSchema.index({ status: 1 });
orderSchema.index({ pickupDate: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ invoiceNumber: 1 });

export default mongoose.model('Order', orderSchema);
