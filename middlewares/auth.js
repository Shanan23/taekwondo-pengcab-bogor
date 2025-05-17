const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Admin } = require('../models');

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  // For development/demo purposes, we'll skip authentication
  // In production, uncomment the JWT verification code below
  
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // Skip authentication in development mode
    return next();
  }
  
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.redirect('/admin/login');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/admin/login');
  }
};

/**
 * Middleware to check API authentication
 */
const apiAuth = (req, res, next) => {
  // For development/demo purposes, we'll skip authentication
  // In production, uncomment the JWT verification code below
  
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // Skip authentication in development mode
    return next();
  }
  
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('API Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authenticateJWT = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.redirect('/admin/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'taekwondo-pengcab-bogor-secret-key');
    
    // Get user from database
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin || !admin.active) {
      return res.redirect('/admin/login');
    }

    // Attach user to request
    req.user = admin;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/admin/login');
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).render('admin/error', {
      title: 'Access Denied',
      message: 'You do not have permission to access this resource.',
      active: ''
    });
  }
};

module.exports = {
  isAuthenticated,
  apiAuth,
  authenticateJWT,
  checkAdmin
}; 