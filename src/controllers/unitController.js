const { Unit, Member } = require('../models');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll({
      order: [['name', 'ASC']]
    });
    
    res.render('admin/units', {
      title: 'Manage Units',
      active: 'units',
      units
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    req.flash('error', 'Failed to fetch units');
    res.redirect('/admin/dashboard');
  }
};

// Render create unit form
exports.renderCreateForm = async (req, res) => {
  try {
    res.render('admin/unit-form', {
      title: 'Create Unit',
      active: 'units',
      unit: null
    });
  } catch (error) {
    console.error('Error rendering unit form:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/units');
  }
};

// Create new unit
exports.createUnit = async (req, res) => {
  try {
    const {
      name, description, address, region, contactPerson,
      phone, email, establishedDate, schedule
    } = req.body;
    
    // Generate slug from name
    const slug = slugify(name, {
      lower: true,
      strict: true
    });
    
    // Handle logo upload
    let logoFileName = null;
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      logoFileName = `${Date.now()}-${uuidv4()}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/units');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save the file
      fs.writeFileSync(path.join(uploadDir, logoFileName), req.file.buffer);
    }
    
    // Parse schedule if provided
    let parsedSchedule = null;
    if (schedule) {
      try {
        parsedSchedule = JSON.parse(schedule);
      } catch (e) {
        console.error('Error parsing schedule:', e);
      }
    }
    
    // Create the unit
    await Unit.create({
      name,
      slug,
      description,
      address,
      region,
      contactPerson,
      phone,
      email,
      logo: logoFileName ? `/uploads/units/${logoFileName}` : null,
      establishedDate,
      schedule: parsedSchedule
    });
    
    req.flash('success', 'Unit created successfully');
    res.redirect('/admin/units');
  } catch (error) {
    console.error('Error creating unit:', error);
    req.flash('error', 'Failed to create unit: ' + error.message);
    res.redirect('/admin/units/create');
  }
};

// Render edit unit form
exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByPk(id);
    
    if (!unit) {
      req.flash('error', 'Unit not found');
      return res.redirect('/admin/units');
    }
    
    res.render('admin/unit-form', {
      title: 'Edit Unit',
      active: 'units',
      unit
    });
  } catch (error) {
    console.error('Error rendering edit form:', error);
    req.flash('error', 'Failed to load edit form');
    res.redirect('/admin/units');
  }
};

// Update unit
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, address, region, contactPerson,
      phone, email, establishedDate, schedule, active
    } = req.body;
    
    const unit = await Unit.findByPk(id);
    
    if (!unit) {
      req.flash('error', 'Unit not found');
      return res.redirect('/admin/units');
    }
    
    // Generate new slug only if name has changed
    let slug = unit.slug;
    if (name !== unit.name) {
      slug = slugify(name, {
        lower: true,
        strict: true
      });
    }
    
    // Handle logo upload
    let logoFileName = unit.logo;
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      logoFileName = `/uploads/units/${Date.now()}-${uuidv4()}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/units');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save the file
      fs.writeFileSync(path.join(uploadDir, logoFileName.replace('/uploads/units/', '')), req.file.buffer);
      
      // Delete old logo if exists
      if (unit.logo) {
        const oldLogoPath = path.join(__dirname, '..', unit.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
    }
    
    // Parse schedule if provided
    let parsedSchedule = unit.schedule;
    if (schedule) {
      try {
        parsedSchedule = JSON.parse(schedule);
      } catch (e) {
        console.error('Error parsing schedule:', e);
      }
    }
    
    // Update the unit
    await unit.update({
      name,
      slug,
      description,
      address,
      region,
      contactPerson,
      phone,
      email,
      logo: logoFileName,
      establishedDate,
      schedule: parsedSchedule,
      active: active === 'true'
    });
    
    req.flash('success', 'Unit updated successfully');
    res.redirect('/admin/units');
  } catch (error) {
    console.error('Error updating unit:', error);
    req.flash('error', 'Failed to update unit: ' + error.message);
    res.redirect(`/admin/units/edit/${req.params.id}`);
  }
};

// Delete unit
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByPk(id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Check if there are members associated with this unit
    const membersCount = await Member.count({ where: { unitId: id } });
    
    if (membersCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete unit because it has associated members'
      });
    }
    
    // Delete logo if exists
    if (unit.logo) {
      const logoPath = path.join(__dirname, '..', unit.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await unit.destroy();
    
    return res.json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete unit' });
  }
};

// Get unit details
exports.getUnitDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByPk(id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    // Get member count
    const membersCount = await Member.count({ where: { unitId: id } });
    
    // Get some sample members
    const members = await Member.findAll({
      where: { unitId: id },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    return res.json({
      success: true,
      unit,
      membersCount,
      sampleMembers: members
    });
  } catch (error) {
    console.error('Error fetching unit details:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch unit details' });
  }
}; 