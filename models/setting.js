"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init(
    {
      sitename_logo: DataTypes.STRING,
      description: DataTypes.TEXT,
      logo: DataTypes.STRING,
      theme_color: DataTypes.STRING,
      facebook_icon: DataTypes.STRING,
      twitter_icon: DataTypes.STRING,
      insta_icon: DataTypes.STRING,
      linkedin_icon: DataTypes.STRING,
      location: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      terms: DataTypes.TEXT,
      privacy: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Setting",
      tableName: "Settings",
    }
  );
  return Setting;
};
