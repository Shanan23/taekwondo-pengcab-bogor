'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(255)
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'replied'),
      defaultValue: 'unread'
    },
    adminNotes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'contacts',
    schema: 'public'
  });

  // Define associations
  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      foreignKey: 'responseBy',
      as: 'responder'
    });
  };

  return Contact;
}; 