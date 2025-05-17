const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Taekwondo Pengcab Bogor'
    },
    siteDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    socialMedia: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            facebook: null,
            instagram: null,
            twitter: null,
            youtube: null
        }
    }
}, {
    timestamps: true
});

module.exports = Settings; 