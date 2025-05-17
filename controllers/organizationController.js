const { Organization } = require('../models');
const fs = require('fs');
const path = require('path');

// List all organization members
exports.index = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.render('admin/organization/index', {
      title: 'Organization Structure',
      active: 'organization',
      organizations
    });
  } catch (error) {
    console.error('Organization listing error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading organization data',
      active: 'organization'
    });
  }
};

// Display form to create a new organization member
exports.create = (req, res) => {
  res.render('admin/organization/form', {
    title: 'Add New Member',
    active: 'organization',
    organization: null,
    isEdit: false
  });
};

// Store a new organization member
exports.store = async (req, res) => {
  try {
    const { name, position, department, bio, email, phone, socialMedia, order, active } = req.body;
    let photo = null;
    
    // Handle file upload
    if (req.file) {
      photo = `/uploads/organization/${req.file.filename}`;
    }
    
    // Parse social media if provided
    let parsedSocialMedia = {};
    if (socialMedia) {
      try {
        parsedSocialMedia = JSON.parse(socialMedia);
      } catch (e) {
        // Try to parse from form fields
        if (req.body['socialMedia.facebook']) {
          parsedSocialMedia.facebook = req.body['socialMedia.facebook'];
        }
        if (req.body['socialMedia.instagram']) {
          parsedSocialMedia.instagram = req.body['socialMedia.instagram'];
        }
        if (req.body['socialMedia.twitter']) {
          parsedSocialMedia.twitter = req.body['socialMedia.twitter'];
        }
      }
    }
    
    // Create organization member
    const newOrganization = await Organization.create({
      name,
      position,
      department,
      bio,
      email,
      phone,
      photo,
      socialMedia: Object.keys(parsedSocialMedia).length > 0 ? parsedSocialMedia : null,
      order: order || 0,
      active: active === 'true' || active === true
    });
    
    req.flash('success', 'Organization member added successfully');
    res.redirect('/admin/organization');
  } catch (error) {
    console.error('Organization creation error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError') {
      return res.render('admin/organization/form', {
        title: 'Add New Member',
        active: 'organization',
        organization: req.body,
        isEdit: false,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error adding organization member');
    res.redirect('/admin/organization/create');
  }
};

// Display form to edit an organization member
exports.edit = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    
    if (!organization) {
      req.flash('error', 'Organization member not found');
      return res.redirect('/admin/organization');
    }
    
    res.render('admin/organization/form', {
      title: 'Edit Member',
      active: 'organization',
      organization,
      isEdit: true
    });
  } catch (error) {
    console.error('Organization edit form error:', error);
    req.flash('error', 'Error loading organization data');
    res.redirect('/admin/organization');
  }
};

// Update an organization member
exports.update = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    
    if (!organization) {
      req.flash('error', 'Organization member not found');
      return res.redirect('/admin/organization');
    }
    
    const { name, position, department, bio, email, phone, socialMedia, order, active } = req.body;
    
    // Handle file upload
    let photo = organization.photo;
    if (req.file) {
      // Remove old photo if exists
      if (organization.photo) {
        const oldPhotoPath = path.join(__dirname, '..', 'public', organization.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      photo = `/uploads/organization/${req.file.filename}`;
    }
    
    // Parse social media
    let parsedSocialMedia = {};
    if (socialMedia) {
      try {
        parsedSocialMedia = JSON.parse(socialMedia);
      } catch (e) {
        // Try to parse from form fields
        if (req.body['socialMedia.facebook']) {
          parsedSocialMedia.facebook = req.body['socialMedia.facebook'];
        }
        if (req.body['socialMedia.instagram']) {
          parsedSocialMedia.instagram = req.body['socialMedia.instagram'];
        }
        if (req.body['socialMedia.twitter']) {
          parsedSocialMedia.twitter = req.body['socialMedia.twitter'];
        }
      }
    }
    
    // Update organization member
    await organization.update({
      name,
      position,
      department,
      bio,
      email,
      phone,
      photo,
      socialMedia: Object.keys(parsedSocialMedia).length > 0 ? parsedSocialMedia : null,
      order: order || 0,
      active: active === 'true' || active === true
    });
    
    req.flash('success', 'Organization member updated successfully');
    res.redirect('/admin/organization');
  } catch (error) {
    console.error('Organization update error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError') {
      return res.render('admin/organization/form', {
        title: 'Edit Member',
        active: 'organization',
        organization: { ...req.body, id: req.params.id },
        isEdit: true,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error updating organization member');
    res.redirect(`/admin/organization/${req.params.id}/edit`);
  }
};

// Delete an organization member
exports.destroy = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization member not found'
      });
    }
    
    // Remove photo if exists
    if (organization.photo) {
      const photoPath = path.join(__dirname, '..', 'public', organization.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    await organization.destroy();
    
    res.json({
      success: true,
      message: 'Organization member deleted successfully'
    });
  } catch (error) {
    console.error('Organization deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting organization member'
    });
  }
};

// Update order of organization members
exports.updateOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    // Update order of each item
    for (const item of items) {
      await Organization.update(
        { order: item.order },
        { where: { id: item.id } }
      );
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
}; 