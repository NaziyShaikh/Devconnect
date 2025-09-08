import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    console.log('🔐 Verifying token...');
    console.log('   Request URL:', req.originalUrl);
    console.log('   Request method:', req.method);
    console.log('   Headers present:', Object.keys(req.headers));
    console.log('   Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('   Cookies present:', req.cookies ? Object.keys(req.cookies) : 'None');
    console.log('   Cookie token:', req.cookies?.token ? 'Present' : 'Missing');

    // Check for token in Authorization header first
    let token = null;
    let tokenSource = '';

    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      console.log('   Auth header value:', authHeader.substring(0, 20) + '...');
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        tokenSource = 'Authorization header';
      }
    }

    // Fallback to cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      tokenSource = 'Cookie';
      console.log('   Cookie token length:', token.length);
    }

    if (!token) {
      console.log('❌ No token found in request');
      console.log('   Available headers:', req.headers);
      console.log('   Available cookies:', req.cookies);
      return res.status(401).json({ msg: 'No token provided' });
    }

    console.log(`✅ Token found from: ${tokenSource}`);
    console.log(`   Token length: ${token.length} characters`);
    console.log(`   Token preview: ${token.substring(0, 20)}...`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log('✅ Token verified successfully for user:', decoded.id);
    console.log('   User role:', decoded.role);
    console.log('   User email:', decoded.email);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    console.error('   Error name:', err.name);
    console.error('   Error stack:', err.stack);

    if (err.name === 'TokenExpiredError') {
      console.log('   Token expired at:', err.expiredAt);
      return res.status(401).json({ msg: 'Token expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      console.log('   JWT Error details:', err.message);
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
