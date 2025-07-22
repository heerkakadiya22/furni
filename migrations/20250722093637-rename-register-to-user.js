'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename table from 'register' to 'users'
    await queryInterface.renameTable('register', 'users');
  },

  async down(queryInterface, Sequelize) {
    // Rollback to old table name
    await queryInterface.renameTable('users', 'register');
  }
};
