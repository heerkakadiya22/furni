"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      User.hasMany(models.Wishlist, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        defaultValue: "/assets/admin/img/user/default.jpg",
      },
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      hobby: DataTypes.STRING,
      dob: DataTypes.DATEONLY,
      gender: DataTypes.ENUM("male", "female"),

      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "verifiedAt",
      },
      email_expired: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "email_expired",
      },
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
