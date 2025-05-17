const { Contact } = require('../models');

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Create a new contact message
    const contact = await Contact.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'unread'
    });

    // In a full implementation, you could send an email notification here
    // using nodemailer or other email service

    return res.json({
      success: true,
      message: 'Your message has been received. We will contact you soon.',
      contactId: contact.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
};

// Admin: Get all contact messages
exports.getAllContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [
        ['status', 'ASC'],  // Unread first
        ['createdAt', 'DESC']  // Newest first
      ]
    });
    
    res.render('admin/contacts', {
      title: 'Contact Messages',
      active: 'contacts',
      contacts
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    req.flash('error', 'Failed to fetch contact messages');
    res.redirect('/admin/dashboard');
  }
};

// Admin: View contact message details
exports.getContactDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      req.flash('error', 'Contact message not found');
      return res.redirect('/admin/contacts');
    }
    
    // Mark as read if it was unread
    if (contact.status === 'unread') {
      await contact.update({ status: 'read' });
    }
    
    res.render('admin/contact-details', {
      title: 'Contact Message Details',
      active: 'contacts',
      contact
    });
  } catch (error) {
    console.error('Error fetching contact details:', error);
    req.flash('error', 'Failed to fetch contact details');
    res.redirect('/admin/contacts');
  }
};

// Admin: Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.update({
      status,
      adminNotes: notes || contact.adminNotes
    });
    
    return res.json({
      success: true,
      message: 'Contact status updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};

// Admin: Delete contact message
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    await contact.destroy();
    
    return res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
}; 