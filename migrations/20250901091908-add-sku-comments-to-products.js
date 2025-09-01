"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "sku", {
      type: Sequelize.STRING,
      allowNull: true,  
    });

    await queryInterface.addColumn("products", "comments", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "sku");
    await queryInterface.removeColumn("products", "comments");
  },
};
