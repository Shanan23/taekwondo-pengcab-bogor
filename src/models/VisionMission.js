const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VisionMission = sequelize.define('VisionMission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('vision', 'mission'),
        allowNull: false
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

module.exports = VisionMission; 