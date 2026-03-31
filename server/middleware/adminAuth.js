import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

export default async function adminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing admin token' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach admin info to request for downstream handlers.
    const admin = await AdminUser.findById(payload.adminId).select('_id email');
    if (!admin) return res.status(401).json({ message: 'Invalid admin token' });

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid admin token' });
  }
}

