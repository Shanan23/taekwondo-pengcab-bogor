const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true
  },
  registrationLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  registrationDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  isHighlighted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  eventType: {
    type: DataTypes.ENUM('championship', 'training', 'seminar', 'meeting', 'other'),
    defaultValue: 'other'
  },
  participants: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['status']
    },
    {
      fields: ['startDate']
    }
  ]
});

module.exports = Event; 