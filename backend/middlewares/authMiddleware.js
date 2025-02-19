import jwt from 'jsonwebtoken';

// Middleware to protect routes
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
