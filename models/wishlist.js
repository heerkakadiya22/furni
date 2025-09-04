"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: "userId" });
      Wishlist.belongsTo(models.Product, {
        foreignKey: "sku",
        targetKey: "sku",
      });
    }
  }

  Wishlist.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "Wishlists",
    }
  );

  return Wishlist;
};
