"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
    }
  }
  User.init(
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
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
