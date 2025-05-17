const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// Render login page
exports.renderLogin = (req, res) => {
  // Check if user is already logged in
  if (req.cookies.token || req.session.user) {
    return res.redirect('/admin');
  }
  
  res.render('admin/login', {
    title: 'Admin Login',
    active: 'login',
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
};

// Process login
exports.login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    
    if (!admin) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }
    
    // Check if user is active
    if (!admin.active) {
      req.flash('error', 'Your account has been deactivated. Please contact the administrator.');
      return res.redirect('/admin/login');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'taekwondo-pengcab-bogor-secret-key',
      { expiresIn: remember ? '7d' : '24h' }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 7 days or 24 hours
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Save user in session
    req.session.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    
    // Update last login
    await admin.update({ lastLogin: new Date() });
    
    // Redirect to admin dashboard
    res.redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/admin/login');
  }
};

// Logout
exports.logout = (req, res) => {
  // Clear cookie
  res.clearCookie('token');
  
  // Destroy session
  req.session.destroy();
  
  // Redirect to login page
  res.redirect('/admin/login');
};

// Forgot password page
exports.renderForgotPassword = (req, res) => {
  res.render('admin/forgot-password', {
    title: 'Forgot Password',
    active: 'login',
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
};

// Process forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    
    if (!admin) {
      req.flash('error', 'No account found with that email address');
      return res.redirect('/admin/forgot-password');
    }
    
    // In a real app, you would generate a reset token, save it to the database,
    // and send an email with a reset link. For this example, we'll just show a success message.
    
    req.flash('success', 'If an account with that email exists, we have sent a password reset link.');
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Forgot password error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/admin/forgot-password');
  }
};

// Create admin account (for development only)
exports.createAdmin = async (req, res) => {
  try {
    // Check if admin exists
    const adminCount = await Admin.count();
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin
    await Admin.create({
      name: 'Administrator',
      email: 'admin@taekwondobogor.org',
      password: hashedPassword,
      role: 'admin',
      active: true
    });
    
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Get current user profile
exports.profile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!admin) {
      return res.status(404).render('admin/error', {
        title: 'User Not Found',
        message: 'User profile not found',
        active: 'profile'
      });
    }
    
    res.render('admin/profile', {
      title: 'Profile',
      active: 'profile',
      admin
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error retrieving user profile',
      active: 'profile'
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }
    
    // Get current user
    const admin = await Admin.findByPk(req.user.id);
    
    // Verify current password
    if (!(await admin.validPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    admin.password = newPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password'
    });
  }
}; 