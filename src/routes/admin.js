const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

// Middleware for authentication
const { isAuthenticated } = require('../middlewares/auth');

// Import controllers
const authController = require('../controllers/authController');
const unitController = require('../controllers/unitController');
const memberController = require('../controllers/memberController');
const contactController = require('../controllers/contactController');
const aboutController = require('../controllers/aboutController');
const visionMissionController = require('../controllers/visionMissionController');
const organizationController = require('../controllers/organizationController');
const eventController = require('../controllers/eventController');
const settingsController = require('../controllers/settingsController');

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
router.get('/about', isAuthenticated, aboutController.getAbout);
router.post('/about', isAuthenticated, upload.single('image'), aboutController.updateAbout);

// Vision Mission Management
router.get('/vision-mission', isAuthenticated, visionMissionController.getVisionMission);
router.post('/vision-mission/vision', isAuthenticated, upload.single('image'), visionMissionController.updateVision);
router.post('/vision-mission/mission', isAuthenticated, upload.single('image'), visionMissionController.updateMission);

// Organization Structure Management
router.get('/organization', isAuthenticated, organizationController.index);
router.get('/organization/create', isAuthenticated, organizationController.create);
router.post('/organization/create', isAuthenticated, upload.single('photo'), organizationController.store);
router.get('/organization/:id/edit', isAuthenticated, organizationController.edit);
router.put('/organization/:id', isAuthenticated, upload.single('photo'), organizationController.update);
router.delete('/organization/:id', isAuthenticated, organizationController.destroy);
router.post('/organization/order', isAuthenticated, organizationController.updateOrder);

// Events Management
router.get('/events', isAuthenticated, eventController.index);
router.get('/events/create', isAuthenticated, eventController.create);
router.post('/events/create', isAuthenticated, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), eventController.store);
router.get('/events/:id/edit', isAuthenticated, eventController.edit);
router.put('/events/:id', isAuthenticated, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), eventController.update);
router.delete('/events/:id', isAuthenticated, eventController.destroy);

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
router.get('/settings', isAuthenticated, settingsController.getSettings);
router.post('/settings/general', isAuthenticated, settingsController.updateGeneralSettings);
router.post('/settings/social', isAuthenticated, settingsController.updateSocialSettings);
router.post('/settings/password', isAuthenticated, settingsController.changePassword);

// Development routes - create initial admin account (remove in production)
if (process.env.NODE_ENV === 'development') {
  router.get('/create-admin', authController.createAdmin);
}

module.exports = router; 