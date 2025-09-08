import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    console.log('🔐 Verifying token...');
    console.log('   Headers:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('   Cookies:', req.cookies ? Object.keys(req.cookies) : 'None');

    // Check for token in Authorization header first
    let token = null;
    let tokenSource = '';

    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        tokenSource = 'Authorization header';
      }
    }

    // Fallback to cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      tokenSource = 'Cookie';
    }

    if (!token) {
      console.log('❌ No token found in request');
      return res.status(401).json({ msg: 'No token provided' });
    }

    console.log(`✅ Token found from: ${tokenSource}`);
    console.log(`   Token length: ${token.length} characters`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log('✅ Token verified successfully for user:', decoded.id);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token format' });
    }

    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }
  next();
};
