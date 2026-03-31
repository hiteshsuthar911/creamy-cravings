import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import testimonialRoutes from './routes/testimonials.js';
import adminAuthRoutes from './routes/adminAuth.js';
import adminProductsRoutes from './routes/adminProducts.js';
import adminTestimonialsRoutes from './routes/adminTestimonials.js';
import adminOrdersRoutes from './routes/adminOrders.js';
import adminDashboardRoutes from './routes/adminDashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');
const hasClientBuild = existsSync(clientDistPath);

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/testimonials', adminTestimonialsRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Creamy Cravings API is running' });
});

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creamy-cravings';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
