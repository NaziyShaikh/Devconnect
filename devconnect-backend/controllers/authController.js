import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'developer' } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please provide a valid email' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        msg: 'This email is already registered. Please try logging in instead.',
        existingEmail: true 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'developer',
      username,  // set username here
    });
    
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Determine cookie settings based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps = req.protocol === 'https';
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

    // Enhanced cookie settings for better cross-domain compatibility
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction && isHttps && !isLocalhost, // secure only in production with https, not for localhost
      sameSite: isProduction && !isLocalhost ? 'none' : 'lax', // none in production for cross-site, lax for localhost
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isLocalhost ? undefined : process.env.COOKIE_DOMAIN, // set domain for production
    };

    console.log('🍪 Setting cookie with options:', cookieOptions);
    console.log('   Environment:', { isProduction, isHttps, protocol: req.protocol });

    res.cookie('token', token, cookieOptions).status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email
      },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt received');
    console.log('   Request body:', { email: req.body.email, password: req.body.password ? '[HIDDEN]' : 'missing' });
    console.log('   Request headers:', req.headers);
    console.log('   Request cookies:', req.cookies);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please provide a valid email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        msg: 'No account found with this email. Please check your email or register for a new account.',
        emailNotFound: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        msg: 'Incorrect password. Please try again or reset your password.',
        incorrectPassword: true 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Determine cookie settings based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps = req.protocol === 'https';
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

    // Enhanced cookie settings for better cross-domain compatibility
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction && isHttps && !isLocalhost, // secure only in production with https, not for localhost
      sameSite: isProduction && !isLocalhost ? 'none' : 'lax', // none in production for cross-site, lax for localhost
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isLocalhost ? undefined : process.env.COOKIE_DOMAIN, // set domain for production
    };

    console.log('🍪 Setting login cookie with options:', cookieOptions);
    console.log('   Environment:', { isProduction, isHttps, protocol: req.protocol });

    res.cookie('token', token, cookieOptions).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      },
      token
    });

    // Create a welcome notification on login
    try {
      console.log('🔔 Creating welcome notification for user:', user._id);
      const notification = await createNotification(user._id, 'welcome', 'Welcome back to DevConnect!', ioInstance);
      console.log('✅ Welcome notification created:', notification);
    } catch (notifErr) {
      console.error('❌ Failed to create welcome notification:', notifErr);
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  // Determine cookie settings based on environment for proper clearing
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = req.protocol === 'https';
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction && isHttps && !isLocalhost,
    sameSite: isProduction && !isLocalhost ? 'none' : 'lax',
    domain: isLocalhost ? undefined : process.env.COOKIE_DOMAIN,
  };

  console.log('🚪 Clearing cookie with options:', cookieOptions);
  res.clearCookie('token', cookieOptions).json({ msg: 'Logged out' });
};

export const refreshToken = async (req, res) => {
  try {
    console.log('🔄 Token refresh requested');
    console.log('   Current user:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'No valid session found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate new token
    const newToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Determine cookie settings based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps = req.protocol === 'https';
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction && isHttps && !isLocalhost,
      sameSite: isProduction && !isLocalhost ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isLocalhost ? undefined : process.env.COOKIE_DOMAIN,
    };

    console.log('🔄 Setting new token cookie with options:', cookieOptions);

    res.cookie('token', newToken, cookieOptions).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      },
      token: newToken,
      msg: 'Token refreshed successfully'
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ msg: 'Server error during token refresh' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('getCurrentUser error: req.user or req.user.id is undefined');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.error('getCurrentUser error: User not found');
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please provide a valid email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        msg: 'If an account with this email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = jwt.sign(
      { id: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Mock email sending (in production, use nodemailer or similar)
    console.log('🔐 Password Reset Request:');
    console.log(`   Email: ${email}`);
    console.log(`   Reset Token: ${resetToken}`);
    console.log(`   Reset Link: http://localhost:3001/reset-password?token=${resetToken}`);

    // In a real implementation, you would send an email here
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({...});

    res.status(200).json({
      msg: 'If an account with this email exists, a password reset link has been sent.',
      // For development/testing, include the token in response
      ...(process.env.NODE_ENV !== 'production' && { resetToken })
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error during password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
    } catch (err) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Server error during password reset' });
  }
};
