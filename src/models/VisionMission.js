const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const VisionMission = sequelize.define('VisionMission', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('vision', 'mission'),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'VisionMissions',
        timestamps: true
    });

    // Define associations
    VisionMission.associate = function(models) {
        // Add associations if needed
    };

    return VisionMission;
}; 