const { Event } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// List all events
exports.index = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['startDate', 'DESC']]
    });
    
    res.render('admin/events/index', {
      title: 'Event Management',
      active: 'events',
      events
    });
  } catch (error) {
    console.error('Event listing error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading event data',
      active: 'events'
    });
  }
};

// Display form to create a new event
exports.create = (req, res) => {
  res.render('admin/events/form', {
    title: 'Add New Event',
    active: 'events',
    event: null,
    isEdit: false
  });
};

// Store a new event
exports.store = async (req, res) => {
  try {
    const {
      title, slug, description, shortDescription, location,
      startDate, endDate, registrationDeadline, status,
      isHighlighted, organizer, contact, eventType, participants,
      registrationLink
    } = req.body;
    
    let featuredImage = null;
    let gallery = [];
    
    // Handle featured image upload
    if (req.files && req.files.featuredImage) {
      featuredImage = `/uploads/events/${req.files.featuredImage[0].filename}`;
    }
    
    // Handle gallery uploads
    if (req.files && req.files.gallery) {
      gallery = req.files.gallery.map(file => `/uploads/events/gallery/${file.filename}`);
    }
    
    // Create slug if not provided
    const eventSlug = slug || title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    // Create event
    const newEvent = await Event.create({
      title,
      slug: eventSlug,
      description,
      shortDescription,
      location,
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || null,
      featuredImage,
      gallery: gallery.length > 0 ? gallery : null,
      registrationLink,
      status,
      isHighlighted: isHighlighted === 'true' || isHighlighted === true,
      organizer,
      contact,
      eventType,
      participants: participants || null
    });
    
    req.flash('success', 'Event created successfully');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Event creation error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.render('admin/events/form', {
        title: 'Add New Event',
        active: 'events',
        event: req.body,
        isEdit: false,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error creating event');
    res.redirect('/admin/events/create');
  }
};

// Display form to edit an event
exports.edit = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }
    
    res.render('admin/events/form', {
      title: 'Edit Event',
      active: 'events',
      event,
      isEdit: true
    });
  } catch (error) {
    console.error('Event edit form error:', error);
    req.flash('error', 'Error loading event data');
    res.redirect('/admin/events');
  }
};

// Update an event
exports.update = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }
    
    const {
      title, slug, description, shortDescription, location,
      startDate, endDate, registrationDeadline, status,
      isHighlighted, organizer, contact, eventType, participants,
      registrationLink, removeGallery, removeImage
    } = req.body;
    
    let featuredImage = event.featuredImage;
    let gallery = event.gallery || [];
    
    // Handle featured image removal
    if (removeImage === 'true' && featuredImage) {
      const imagePath = path.join(__dirname, '..', 'public', featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      featuredImage = null;
    }
    
    // Handle featured image upload
    if (req.files && req.files.featuredImage) {
      // Remove old image if exists
      if (featuredImage) {
        const oldImagePath = path.join(__dirname, '..', 'public', featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      featuredImage = `/uploads/events/${req.files.featuredImage[0].filename}`;
    }
    
    // Handle gallery removal
    if (removeGallery === 'true' && gallery && gallery.length > 0) {
      gallery.forEach(image => {
        const imagePath = path.join(__dirname, '..', 'public', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      gallery = [];
    }
    
    // Handle gallery uploads
    if (req.files && req.files.gallery) {
      const newGalleryImages = req.files.gallery.map(file => `/uploads/events/gallery/${file.filename}`);
      gallery = gallery.concat(newGalleryImages);
    }
    
    // Create slug if not provided
    const eventSlug = slug || title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    // Update event
    await event.update({
      title,
      slug: eventSlug,
      description,
      shortDescription,
      location,
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || null,
      featuredImage,
      gallery: gallery.length > 0 ? gallery : null,
      registrationLink,
      status,
      isHighlighted: isHighlighted === 'true' || isHighlighted === true,
      organizer,
      contact,
      eventType,
      participants: participants || null
    });
    
    req.flash('success', 'Event updated successfully');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Event update error:', error);
    
    // Check for validation error
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.render('admin/events/form', {
        title: 'Edit Event',
        active: 'events',
        event: { ...req.body, id: req.params.id },
        isEdit: true,
        errors: error.errors.map(e => e.message)
      });
    }
    
    req.flash('error', 'Error updating event');
    res.redirect(`/admin/events/${req.params.id}/edit`);
  }
};

// Delete an event
exports.destroy = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Remove featured image if exists
    if (event.featuredImage) {
      const imagePath = path.join(__dirname, '..', 'public', event.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Remove gallery images if exist
    if (event.gallery && event.gallery.length > 0) {
      event.gallery.forEach(image => {
        const imagePath = path.join(__dirname, '..', 'public', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    await event.destroy();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event'
    });
  }
};

// Update event status
exports.updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await event.update({ status });
    
    res.json({
      success: true,
      message: 'Event status updated successfully'
    });
  } catch (error) {
    console.error('Event status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event status'
    });
  }
}; 