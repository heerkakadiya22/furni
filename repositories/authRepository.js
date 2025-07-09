const { Register } = require("../models");

const createUser = async (userData) => {
  return await Register.create(userData);
};

const findByEmail = async (email) => {
  return await Register.findOne({ where: { email } });
};

module.exports = {
  createUser,
  findByEmail,
};