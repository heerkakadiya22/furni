"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop 'createdAt' column from 'users' table
    await queryInterface.removeColumn("users", "createdAt");
  },

  async down(queryInterface, Sequelize) {
    // Add 'createdAt' column back in case of rollback
    await queryInterface.addColumn("users", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },
};
