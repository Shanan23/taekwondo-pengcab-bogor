'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'replied', 'archived'),
    defaultValue: 'unread'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responseBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
}, {
  tableName: 'contacts',
  timestamps: true
});

// Define associations
Contact.associate = function(models) {
  Contact.belongsTo(models.Admin, {
    foreignKey: 'responseBy',
    as: 'respondedBy'
  });
};

module.exports = Contact; 