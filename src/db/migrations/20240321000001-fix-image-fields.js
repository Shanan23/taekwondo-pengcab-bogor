'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change About.image from BLOB to STRING
    await queryInterface.changeColumn('Abouts', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Change VisionMission.image from BLOB to STRING
    await queryInterface.changeColumn('VisionMissions', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert About.image back to BLOB
    await queryInterface.changeColumn('Abouts', 'image', {
      type: Sequelize.BLOB,
      allowNull: true
    });

    // Revert VisionMission.image back to BLOB
    await queryInterface.changeColumn('VisionMissions', 'image', {
      type: Sequelize.BLOB,
      allowNull: true
    });
  }
}; 