const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Middleware for authentication
const { isAuthenticated } = require('../middlewares/auth');

// Import controllers
const authController = require('../controllers/authController');
const unitController = require('../controllers/unitController');
const memberController = require('../controllers/memberController');
const contactController = require('../controllers/contactController');

// Authentication routes
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/forgot-password', authController.renderForgotPassword);
router.post('/forgot-password', authController.forgotPassword);

// Admin Dashboard
router.get('/', isAuthenticated, (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    active: 'dashboard'
  });
});

// About Us Management
router.get('/about', isAuthenticated, (req, res) => {
  res.render('admin/about', {
    title: 'Manage About Us',
    active: 'about'
  });
});

// Vision Mission Management
router.get('/vision-mission', isAuthenticated, (req, res) => {
  res.render('admin/vision-mission', {
    title: 'Manage Vision & Mission',
    active: 'vision-mission'
  });
});

// Organization Structure Management
router.get('/organization', isAuthenticated, (req, res) => {
  res.render('admin/organization', {
    title: 'Manage Organization Structure',
    active: 'organization'
  });
});

// Events Management
router.get('/events', isAuthenticated, (req, res) => {
  res.render('admin/events', {
    title: 'Manage Events',
    active: 'events'
  });
});

// Create/Edit Event
router.get('/events/create', isAuthenticated, (req, res) => {
  res.render('admin/event-form', {
    title: 'Create Event',
    active: 'events',
    event: null
  });
});

router.get('/events/edit/:id', isAuthenticated, (req, res) => {
  res.render('admin/event-form', {
    title: 'Edit Event',
    active: 'events',
    event: {} // Will be populated with actual event data
  });
});

// Units Management
router.get('/units', isAuthenticated, unitController.getAllUnits);
router.get('/units/create', isAuthenticated, unitController.renderCreateForm);
router.post('/units/create', isAuthenticated, upload.single('logo'), unitController.createUnit);
router.get('/units/edit/:id', isAuthenticated, unitController.renderEditForm);
router.post('/units/edit/:id', isAuthenticated, upload.single('logo'), unitController.updateUnit);
router.delete('/units/:id', isAuthenticated, unitController.deleteUnit);
router.get('/units/:id/details', isAuthenticated, unitController.getUnitDetails);

// Taekwondoin (Members) Management
router.get('/members', isAuthenticated, memberController.getAllMembers);
router.get('/members/create', isAuthenticated, memberController.renderCreateForm);
router.post('/members/create', isAuthenticated, upload.single('photo'), memberController.createMember);
router.get('/members/edit/:id', isAuthenticated, memberController.renderEditForm);
router.post('/members/edit/:id', isAuthenticated, upload.single('photo'), memberController.updateMember);
router.delete('/members/:id', isAuthenticated, memberController.deleteMember);
router.get('/members/search', isAuthenticated, memberController.searchMembers);

// Contact Messages Management
router.get('/contacts', isAuthenticated, contactController.getAllContactMessages);
router.get('/contacts/:id', isAuthenticated, contactController.getContactDetails);
router.post('/contacts/:id/status', isAuthenticated, contactController.updateContactStatus);
router.delete('/contacts/:id', isAuthenticated, contactController.deleteContact);

// Settings
router.get('/settings', isAuthenticated, (req, res) => {
  res.render('admin/settings', {
    title: 'Settings',
    active: 'settings'
  });
});

// Development routes - create initial admin account (remove in production)
if (process.env.NODE_ENV === 'development') {
  router.get('/create-admin', authController.createAdmin);
}

module.exports = router; 