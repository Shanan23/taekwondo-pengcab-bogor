const { Content } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// List all content pages
exports.index = async (req, res) => {
  try {
    const contents = await Content.findAll({
      order: [
        ['type', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.render('admin/content/index', {
      title: 'Content Management',
      active: 'content',
      contents
    });
  } catch (error) {
    console.error('Content listing error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading content data',
      active: 'content'
    });
  }
};

// Display form to create a new content
exports.create = (req, res) => {
  res.render('admin/content/form', {
    title: 'Add New Content',
    active: 'content',
    content: null,
    isEdit: false
  });
};

// Store a new content
exports.store = async (req, res) => {
  try {
    const { title, slug, content, type, metaTitle, metaDescription, status } = req.body;
    let featuredImage = null;
    
    // Handle file upload
    if (req.file) {
      featuredImage = `/uploads/content/${req.file.filename}`;
    }
    
    // Create content
    const newContent = await Content.create({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      content,
      type,
      featuredImage,
      metaTitle: metaTitle || title,
      metaDescription,
      status,
      publishedAt: status === 'published' ? new Date() : null
    });
    
    req.flash('success', 'Content created successfully');
    res.redirect(`/admin/content/${newContent.id}/edit`);
  } catch (error) {
    console.error('Content creation error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.render('admin/content/form', {
        title: 'Add New Content',
        active: 'content',
        content: req.body,
        isEdit: false,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error creating content');
    res.redirect('/admin/content/create');
  }
};

// Display form to edit a content
exports.edit = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      req.flash('error', 'Content not found');
      return res.redirect('/admin/content');
    }
    
    res.render('admin/content/form', {
      title: 'Edit Content',
      active: 'content',
      content,
      isEdit: true
    });
  } catch (error) {
    console.error('Content edit form error:', error);
    req.flash('error', 'Error loading content data');
    res.redirect('/admin/content');
  }
};

// Update a content
exports.update = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      req.flash('error', 'Content not found');
      return res.redirect('/admin/content');
    }
    
    const { title, slug, content: contentHtml, type, metaTitle, metaDescription, status } = req.body;
    const oldStatus = content.status;
    
    // Handle file upload
    let featuredImage = content.featuredImage;
    if (req.file) {
      // Remove old image if exists
      if (content.featuredImage) {
        const oldImagePath = path.join(__dirname, '..', 'public', content.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      featuredImage = `/uploads/content/${req.file.filename}`;
    }
    
    // Update content
    await content.update({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      content: contentHtml,
      type,
      featuredImage,
      metaTitle: metaTitle || title,
      metaDescription,
      status,
      publishedAt: (status === 'published' && oldStatus !== 'published') ? new Date() : content.publishedAt
    });
    
    req.flash('success', 'Content updated successfully');
    res.redirect('/admin/content');
  } catch (error) {
    console.error('Content update error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.render('admin/content/form', {
        title: 'Edit Content',
        active: 'content',
        content: { ...req.body, id: req.params.id },
        isEdit: true,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error updating content');
    res.redirect(`/admin/content/${req.params.id}/edit`);
  }
};

// Delete a content
exports.destroy = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Remove featured image if exists
    if (content.featuredImage) {
      const imagePath = path.join(__dirname, '..', 'public', content.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await content.destroy();
    
    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Content deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content'
    });
  }
}; 