'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.JSON,
        allowNull: true
      },
      contactPerson: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      schedule: {
        type: Sequelize.JSON,
        allowNull: true
      },
      establishedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      socialMedia: {
        type: Sequelize.JSON,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      memberCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Units', ['slug'], {
      unique: true
    });
    await queryInterface.addIndex('Units', ['region']);
    await queryInterface.addIndex('Units', ['active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Units');
  }
}; 