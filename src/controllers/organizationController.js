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
      title: 'Organization Management',
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
    isEdit: false,
    errors: []
  });
};

// Store a new organization member
exports.store = async (req, res) => {
  try {
    const { name, position, department, bio, email, phone, order, active } = req.body;
    let photo = null;
    
    // Handle file upload
    if (req.file) {
      photo = `/uploads/organization/${req.file.filename}`;
    }
    
    // Parse social media
    const socialMedia = {
      facebook: req.body['socialMedia[facebook]'] || null,
      instagram: req.body['socialMedia[instagram]'] || null,
      twitter: req.body['socialMedia[twitter]'] || null
    };
    
    // Create organization member
    await Organization.create({
      name,
      position,
      department,
      bio,
      email,
      phone,
      photo,
      socialMedia,
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
      isEdit: true,
      errors: []
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
    
    const { name, position, department, bio, email, phone, order, active } = req.body;
    
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
    const socialMedia = {
      facebook: req.body['socialMedia[facebook]'] || null,
      instagram: req.body['socialMedia[instagram]'] || null,
      twitter: req.body['socialMedia[twitter]'] || null
    };
    
    // Update organization member
    await organization.update({
      name,
      position,
      department,
      bio,
      email,
      phone,
      photo,
      socialMedia,
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

// Get organization data
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne();
    
    res.render('admin/organization', {
      title: 'Manage Organization Structure',
      active: 'organization',
      organization: organization
    });
  } catch (error) {
    req.flash('error', 'Error fetching organization data');
    res.redirect('/admin');
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    const { content } = req.body;
    let organization = await Organization.findOne();

    if (organization) {
      organization.content = content;
      if (req.file) {
        organization.image = req.file.buffer;
      }
      await organization.save();
    } else {
      organization = new Organization({
        content,
        image: req.file ? req.file.buffer : null
      });
      await organization.save();
    }

    req.flash('success', 'Organization structure updated successfully');
    res.redirect('/admin/organization');
  } catch (error) {
    req.flash('error', 'Error updating organization structure');
    res.redirect('/admin/organization');
  }
};

module.exports = exports; 