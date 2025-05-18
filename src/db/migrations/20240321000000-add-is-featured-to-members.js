'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, add the column
    await queryInterface.addColumn('Members', 'isFeatured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Then, create the index in a separate transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addIndex('Members', ['isFeatured'], {
        name: 'members_is_featured',
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First, remove the index
    await queryInterface.removeIndex('Members', 'members_is_featured');
    
    // Then, remove the column
    await queryInterface.removeColumn('Members', 'isFeatured');
  }
}; 