module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("register", "roleId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "roles",  // ✅ must match actual table name
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("register", "roleId");
  },
};
