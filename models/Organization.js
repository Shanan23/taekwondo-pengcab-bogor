const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Organization; 