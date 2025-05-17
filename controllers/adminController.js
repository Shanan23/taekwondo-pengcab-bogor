const { 
  Admin,
  Content, 
  Organization, 
  Event, 
  Unit, 
  Member, 
  Contact,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

// Dashboard homepage
exports.dashboard = async (req, res) => {
  try {
    // Get counts for dashboard stats
    const [events, units, members, contacts] = await Promise.all([
      Event.count(),
      Unit.count(),
      Member.count(),
      Contact.count({ where: { status: 'new' } })
    ]);
    
    // Get recent contacts
    const recentContacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get upcoming events
    const upcomingEvents = await Event.findAll({
      where: {
        startDate: {
          [Op.gte]: new Date()
        }
      },
      order: [['startDate', 'ASC']],
      limit: 5
    });
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      active: 'dashboard',
      stats: {
        events,
        units,
        members,
        contacts
      },
      recentContacts,
      upcomingEvents
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading dashboard data',
      active: 'dashboard'
    });
  }
};

// User management section
exports.listUsers = async (req, res) => {
  try {
    const users = await Admin.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    res.render('admin/users/index', {
      title: 'User Management',
      active: 'users',
      users
    });
  } catch (error) {
    console.error('User listing error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading user data',
      active: 'users'
    });
  }
};

exports.newUserForm = (req, res) => {
  res.render('admin/users/form', {
    title: 'Add New User',
    active: 'users',
    user: null,
    isEdit: false
  });
};

exports.editUserForm = async (req, res) => {
  try {
    const user = await Admin.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).render('admin/error', {
        title: 'User Not Found',
        message: 'The requested user was not found',
        active: 'users'
      });
    }
    
    res.render('admin/users/form', {
      title: 'Edit User',
      active: 'users',
      user,
      isEdit: true
    });
  } catch (error) {
    console.error('Edit user form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading user data',
      active: 'users'
    });
  }
};

// System stats
exports.systemStats = async (req, res) => {
  try {
    // Database stats
    const dbStats = await sequelize.query("SELECT pg_database_size(current_database()) as size", {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Table counts
    const [
      adminsCount,
      contentsCount,
      organizationsCount,
      eventsCount,
      unitsCount,
      membersCount,
      contactsCount
    ] = await Promise.all([
      Admin.count(),
      Content.count(),
      Organization.count(),
      Event.count(),
      Unit.count(),
      Member.count(),
      Contact.count()
    ]);
    
    res.render('admin/system', {
      title: 'System Information',
      active: 'system',
      dbStats: {
        name: process.env.DB_NAME || 'taekwondo_bogor',
        size: (parseInt(dbStats[0]?.size) / (1024 * 1024)).toFixed(2) + ' MB'
      },
      tableCounts: {
        admins: adminsCount,
        contents: contentsCount,
        organizations: organizationsCount,
        events: eventsCount,
        units: unitsCount,
        members: membersCount,
        contacts: contactsCount
      },
      nodeEnv: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    });
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading system information',
      active: 'system'
    });
  }
}; 