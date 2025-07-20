'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Register', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Register', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Register', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Register', 'hobby', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Register', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('Register', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Register', 'image');
    await queryInterface.removeColumn('Register', 'phone');
    await queryInterface.removeColumn('Register', 'address');
    await queryInterface.removeColumn('Register', 'hobby');
    await queryInterface.removeColumn('Register', 'dob');
    await queryInterface.removeColumn('Register', 'gender');
  }
};
