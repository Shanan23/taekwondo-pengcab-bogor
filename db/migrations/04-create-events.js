'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
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
        allowNull: false
      },
      shortDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      featuredImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gallery: {
        type: Sequelize.JSON,
        allowNull: true
      },
      registrationLink: {
        type: Sequelize.STRING,
        allowNull: true
      },
      registrationDeadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'upcoming'
      },
      isHighlighted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      organizer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eventType: {
        type: Sequelize.ENUM('championship', 'training', 'seminar', 'meeting', 'other'),
        defaultValue: 'other'
      },
      participants: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.addIndex('Events', ['slug'], {
      unique: true
    });
    await queryInterface.addIndex('Events', ['status']);
    await queryInterface.addIndex('Events', ['startDate']);
    await queryInterface.addIndex('Events', ['eventType']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
}; 