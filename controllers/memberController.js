const { Member, Unit } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Helper function to generate member ID
const generateMemberId = async () => {
  const prefix = 'TKD';
  const date = new Date().getFullYear().toString().substring(2);
  
  // Get the latest member to determine the sequence number
  const latestMember = await Member.findOne({
    order: [['createdAt', 'DESC']]
  });
  
  let sequenceNumber = 1;
  if (latestMember && latestMember.memberId) {
    const parts = latestMember.memberId.split('-');
    if (parts.length === 3) {
      sequenceNumber = parseInt(parts[2], 10) + 1;
    }
  }
  
  // Format the sequence number to ensure it has 3 digits
  const formattedSequence = String(sequenceNumber).padStart(3, '0');
  
  return `${prefix}-${date}-${formattedSequence}`;
};

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{ model: Unit, attributes: ['name'] }],
      order: [['name', 'ASC']]
    });
    
    res.render('admin/members', {
      title: 'Manage Members',
      active: 'members',
      members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    req.flash('error', 'Failed to fetch members');
    res.redirect('/admin/dashboard');
  }
};

// Render create member form
exports.renderCreateForm = async (req, res) => {
  try {
    const units = await Unit.findAll({ where: { active: true } });
    
    res.render('admin/member-form', {
      title: 'Create Member',
      active: 'members',
      member: null,
      units
    });
  } catch (error) {
    console.error('Error rendering member form:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/members');
  }
};

// Create new member
exports.createMember = async (req, res) => {
  try {
    const {
      name, gender, dateOfBirth, address, phone, email,
      beltRank, danLevel, joinDate, unitId, notes
    } = req.body;
    
    // Generate unique member ID
    const memberId = await generateMemberId();
    
    // Handle photo upload
    let photoFileName = null;
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      photoFileName = `${Date.now()}-${uuidv4()}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/members');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save the file
      fs.writeFileSync(path.join(uploadDir, photoFileName), req.file.buffer);
    }
    
    // Create the member
    await Member.create({
      memberId,
      name,
      gender,
      dateOfBirth,
      photo: photoFileName ? `/uploads/members/${photoFileName}` : null,
      address,
      phone,
      email,
      beltRank,
      danLevel: danLevel || null,
      joinDate,
      unitId,
      notes
    });
    
    req.flash('success', 'Member created successfully');
    res.redirect('/admin/members');
  } catch (error) {
    console.error('Error creating member:', error);
    req.flash('error', 'Failed to create member: ' + error.message);
    res.redirect('/admin/members/create');
  }
};

// Render edit member form
exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);
    const units = await Unit.findAll({ where: { active: true } });
    
    if (!member) {
      req.flash('error', 'Member not found');
      return res.redirect('/admin/members');
    }
    
    res.render('admin/member-form', {
      title: 'Edit Member',
      active: 'members',
      member,
      units
    });
  } catch (error) {
    console.error('Error rendering edit form:', error);
    req.flash('error', 'Failed to load edit form');
    res.redirect('/admin/members');
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, gender, dateOfBirth, address, phone, email,
      beltRank, danLevel, joinDate, unitId, notes, active
    } = req.body;
    
    const member = await Member.findByPk(id);
    
    if (!member) {
      req.flash('error', 'Member not found');
      return res.redirect('/admin/members');
    }
    
    // Handle photo upload
    let photoFileName = member.photo;
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      photoFileName = `/uploads/members/${Date.now()}-${uuidv4()}${fileExt}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/members');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save the file
      fs.writeFileSync(path.join(uploadDir, photoFileName.replace('/uploads/members/', '')), req.file.buffer);
      
      // Delete old photo if exists
      if (member.photo) {
        const oldPhotoPath = path.join(__dirname, '..', member.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }
    
    // Update the member
    await member.update({
      name,
      gender,
      dateOfBirth,
      photo: photoFileName,
      address,
      phone,
      email,
      beltRank,
      danLevel: danLevel || null,
      joinDate,
      unitId,
      notes,
      active: active === 'true'
    });
    
    req.flash('success', 'Member updated successfully');
    res.redirect('/admin/members');
  } catch (error) {
    console.error('Error updating member:', error);
    req.flash('error', 'Failed to update member: ' + error.message);
    res.redirect(`/admin/members/edit/${req.params.id}`);
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    
    // Delete photo if exists
    if (member.photo) {
      const photoPath = path.join(__dirname, '..', member.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    await member.destroy();
    
    return res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete member' });
  }
};

// Search members
exports.searchMembers = async (req, res) => {
  try {
    const { query, unitId, beltRank } = req.query;
    
    // Build the search conditions
    const whereConditions = {};
    
    if (query) {
      whereConditions.name = { [Op.iLike]: `%${query}%` };
    }
    
    if (unitId) {
      whereConditions.unitId = unitId;
    }
    
    if (beltRank) {
      whereConditions.beltRank = beltRank;
    }
    
    const members = await Member.findAll({
      where: whereConditions,
      include: [{ model: Unit, attributes: ['name'] }],
      order: [['name', 'ASC']]
    });
    
    res.json({ success: true, members });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({ success: false, message: 'Failed to search members' });
  }
}; 