const { Setting } = require("../models");

exports.getSettings = async () => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = await Setting.create({
      facebook_icon: "",
      twitter_icon: "",
      insta_icon: "",
      linkedin_icon: "",
    });
  }

  return setting;
};

exports.updateSettings = async (data) => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = await Setting.create(data);
  } else {
    await setting.update(data);
  }

  return setting;
};

exports.clearIconByPlatform = async (platform) => {
  const platformToField = {
    facebook: "facebook_icon",
    twitter: "twitter_icon",
    instagram: "insta_icon",
    linkedin: "linkedin_icon",
  };

  const field = platformToField[platform];
  console.log("➡️ Mapped field:", field);

  if (!field) {
    throw new Error("Invalid platform name");
  }

  const setting = await Setting.findOne();
  if (!setting) {
    throw new Error("Setting not found");
  }

  setting[field] = null;
  await setting.save();
};

exports.clearGeneralField = async (platform) => {
  const allowedFields = ["email", "phone", "location", "sitename_logo", "logo"];

  if (!allowedFields.includes(platform)) {
    throw new Error("Invalid general field");
  }

  const setting = await Setting.findOne();
  if (!setting) throw new Error("Settings not found");

  setting[platform] = null;
  await setting.save();
};

exports.updateSettings = async (data) => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = await Setting.create(data);
  } else {
    await setting.update(data);
  }

  return setting;
};

exports.clearTermsPrivacyField = async (field) => {
  const allowedFields = ["terms", "privacy", "description"];

  if (!allowedFields.includes(field)) {
    throw new Error("Invalid Terms & Privacy field");
  }

  const setting = await Setting.findOne();
  if (!setting) {
    throw new Error("Settings not found");
  }

  setting[field] = null;
  await setting.save();
};
