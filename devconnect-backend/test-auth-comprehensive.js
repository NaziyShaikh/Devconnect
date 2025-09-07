import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from './server.js';
import User from './models/User.js';

describe('Authentication & Authorization Tests', () => {
  let adminToken, developerToken, testUser;

  before(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devconnect-test');
    }

    // Clean up test data
    await User.deleteMany({ email: { $regex: 'test@' } });

    // Create test admin user
    const adminUser = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: '$2a$10$hashedpassword', // pre-hashed password
      role: 'admin'
    });
    await adminUser.save();

    // Create test developer user
    const devUser = new User({
      name: 'Test Developer',
      email: 'developer@test.com',
      password: '$2a$10$hashedpassword', // pre-hashed password
      role: 'developer'
    });
    await devUser.save();

    testUser = devUser;
  });

  after(async () => {
    // Clean up
    await User.deleteMany({ email: { $regex: 'test@' } });
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@test.com',
          password: 'password123'
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('user');
      expect(response.body.user.email).to.equal('newuser@test.com');
      expect(response.body.user.role).to.equal('developer');
    });

    it('should reject registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'newuser@test.com',
          password: 'password123'
        });

      expect(response.status).to.equal(409);
      expect(response.body.msg).to.include('already registered');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).to.equal(400);
      expect(response.body.msg).to.include('valid email');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Password User',
          email: 'shortpass@test.com',
          password: '123'
        });

      expect(response.status).to.equal(400);
      expect(response.body.msg).to.include('at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login admin user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('user');
      expect(response.body.user.role).to.equal('admin');
      adminToken = response.body.token;
    });

    it('should login developer user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'developer@test.com',
          password: 'password123'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('user');
      expect(response.body.user.role).to.equal('developer');
      developerToken = response.body.token;
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).to.equal(401);
      expect(response.body.msg).to.include('Incorrect password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(response.status).to.equal(404);
      expect(response.body.msg).to.include('No account found');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.email).to.equal('admin@test.com');
      expect(response.body.role).to.equal('admin');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).to.equal(401);
      expect(response.body.msg).to.equal('No token provided');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).to.equal(401);
      expect(response.body.msg).to.equal('Token is not valid');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should handle forgot password request for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'admin@test.com'
        });

      expect(response.status).to.equal(200);
      expect(response.body.msg).to.include('password reset link has been sent');
    });

    it('should handle forgot password request for non-existent user (security)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@test.com'
        });

      expect(response.status).to.equal(200);
      expect(response.body.msg).to.include('password reset link has been sent');
    });

    it('should reject forgot password with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email'
        });

      expect(response.status).to.equal(400);
      expect(response.body.msg).to.include('valid email');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken;

    before(async () => {
      // Generate a reset token for testing
      const jwt = (await import('jsonwebtoken')).default;
      resetToken = jwt.sign(
        { id: testUser._id, type: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
    });

    it('should reset password with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'newpassword123'
        });

      expect(response.status).to.equal(200);
      expect(response.body.msg).to.equal('Password reset successfully');
    });

    it('should reject reset password with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalidtoken',
          newPassword: 'newpassword123'
        });

      expect(response.status).to.equal(400);
      expect(response.body.msg).to.include('Invalid or expired reset token');
    });

    it('should reject reset password with short password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: '123'
        });

      expect(response.status).to.equal(400);
      expect(response.body.msg).to.include('at least 6 characters');
    });
  });

  describe('Role-based Access Control', () => {
    it('should allow admin to access admin endpoints', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.not.equal(403);
    });

    it('should deny developer access to admin endpoints', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).to.equal(403);
      expect(response.body.msg).to.include('Admin access required');
    });

    it('should allow developer to access developer endpoints', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).to.not.equal(403);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).to.equal(200);
      expect(response.body.msg).to.equal('Logged out');
    });
  });
});
