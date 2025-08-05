"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sitename_logo: Sequelize.STRING,
      description: Sequelize.TEXT,
      logo: Sequelize.STRING,
      theme_color: Sequelize.STRING,
      facebook_icon: Sequelize.STRING,
      twitter_icon: Sequelize.STRING,
      insta_icon: Sequelize.STRING,
      linkedin_icon: Sequelize.STRING,
      location: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      terms: Sequelize.TEXT,
      privacy: Sequelize.TEXT,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Settings");
  },
};
