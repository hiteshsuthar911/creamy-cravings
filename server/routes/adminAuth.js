import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { adminId: admin._id.toString(), email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

