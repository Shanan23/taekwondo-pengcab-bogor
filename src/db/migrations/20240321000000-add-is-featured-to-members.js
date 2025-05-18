'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Members', 'isFeatured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Add index for isFeatured column
    await queryInterface.addIndex('Members', ['isFeatured']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Members', ['isFeatured']);
    await queryInterface.removeColumn('Members', 'isFeatured');
  }
}; 