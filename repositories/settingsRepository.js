const { Setting } = require("../models");
const { Op } = require("sequelize");

const settingRepository = {
  async find() {
    return await Setting.findOne();
  },

  async update(fields) {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(fields);
      return setting;
    }

    return await setting.update(fields);
  },

  async updateThemeColor(themeColor) {
    return await this.update({ theme_color: themeColor });
  },

  async insertSocialIcon(platform, iconClass, link) {
    const insertData = {
      facebook_icon: null,
      twitter_icon: null,
      insta_icon: null,
      linkedin_icon: null,
      description: link,
    };

    insertData[`${platform}_icon`] = iconClass;

    return await Setting.create(insertData);
  },

  async clearSocialIcons() {
    return await this.update({
      facebook_icon: null,
      twitter_icon: null,
      insta_icon: null,
      linkedin_icon: null,
      description: null,
    });
  },

  async updateLogo(logoPath) {
    return await this.update({ logo: logoPath });
  },

  async findSocialIcons() {
    return await Setting.findAll({
      where: {
        [Op.or]: [
          { facebook_icon: { [Op.ne]: null } },
          { twitter_icon: { [Op.ne]: null } },
          { insta_icon: { [Op.ne]: null } },
          { linkedin_icon: { [Op.ne]: null } },
        ],
      },
    });
  },

  async findThemeColor() {
    const setting = await Setting.findOne();
    return setting?.theme_color || null;
  },
};

module.exports = settingRepository;
