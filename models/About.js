const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const About = sequelize.define('About', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
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

module.exports = About; 