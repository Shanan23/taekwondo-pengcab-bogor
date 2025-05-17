const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    siteDescription: {
        type: DataTypes.TEXT
    },
    contactEmail: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    contactPhone: {
        type: DataTypes.STRING(20)
    },
    socialMedia: {
        type: DataTypes.JSONB,
        defaultValue: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
        }
    }
}, {
    timestamps: true,
    tableName: 'settings',
    schema: 'public'
});

module.exports = Settings; 