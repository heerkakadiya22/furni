"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    static associate(models) {
      Register.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
    }
  }
  Register.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      hobby: DataTypes.STRING,
      dob: DataTypes.DATEONLY,
      gender: DataTypes.ENUM("male", "female"),
    },
    {
      sequelize,
      modelName: "Register",
      tableName: "register",
      timestamps: false,
    }
  );
  return Register;
};
