const { Register } = require("../models");

const createUser = async (userData) => {
  return await Register.create(userData);
};

const findByEmail = async (email) => {
  return await Register.findOne({ where: { email } });
};

const updatePasswordByEmail = (email, newPassword) => {
  return Register.update({ password: newPassword }, { where: { email } });
};
module.exports = {
  createUser,
  findByEmail,
  updatePasswordByEmail,
};
