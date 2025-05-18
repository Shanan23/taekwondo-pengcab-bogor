const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

    // Define associations
    About.associate = function(models) {
        // Add any associations here
    };

    return About;
}; 