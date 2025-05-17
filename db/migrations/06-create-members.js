'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Members', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      memberId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
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
      beltRank: {
        type: Sequelize.ENUM('white', 'yellow', 'green', 'blue', 'red', 'black'),
        allowNull: false,
        defaultValue: 'white'
      },
      danLevel: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      joinDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      lastPromotion: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      certifications: {
        type: Sequelize.JSON,
        allowNull: true
      },
      achievements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      emergencyContact: {
        type: Sequelize.JSON,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      unitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Units',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.addIndex('Members', ['memberId'], {
      unique: true
    });
    await queryInterface.addIndex('Members', ['beltRank']);
    await queryInterface.addIndex('Members', ['unitId']);
    await queryInterface.addIndex('Members', ['active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Members');
  }
}; 