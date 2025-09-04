"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      Product.hasMany(models.Wishlist, { foreignKey: "sku", sourceKey: "sku" });
    }
  }

  Product.init(
    {
      category_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      main_img: DataTypes.STRING,
      sub_img: DataTypes.STRING,
      oldPrice: DataTypes.FLOAT,
      newPrice: DataTypes.FLOAT,
      color: DataTypes.STRING,
      tags: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      dimention: DataTypes.STRING,
      material: DataTypes.STRING,

      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: false,
    }
  );

  return Product;
};
