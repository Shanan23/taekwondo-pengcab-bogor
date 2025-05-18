const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

    // Define associations
    VisionMission.associate = function(models) {
        // Add any associations here
    };

    return VisionMission;
}; 