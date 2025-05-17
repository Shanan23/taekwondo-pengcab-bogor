'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('taekwondo123', salt);

    return queryInterface.bulkInsert('Admins', [{
      username: 'admin',
      password: password,
      email: 'admin@taekwondobogor.org',
      fullName: 'Administrator',
      role: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', { username: 'admin' }, {});
  }
}; 