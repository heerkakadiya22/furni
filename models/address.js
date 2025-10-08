"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }
  Address.init(
    {
      no: DataTypes.STRING,
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      landMark: DataTypes.STRING,
      country: DataTypes.STRING,
      type: DataTypes.STRING,
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fullName: DataTypes.STRING,
      number: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
      timestamps: false,
    }
  );
  return Address;
};
