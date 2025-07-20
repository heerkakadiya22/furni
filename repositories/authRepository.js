const { Register, Role } = require("../models");

const createUser = async (userData) => {
  return await Register.create(userData);
};

const findByEmail = async (email) => {
  return await Register.findOne({ where: { email } });
};

const updatePasswordByEmail = (email, newPassword) => {
  return Register.update({ password: newPassword }, { where: { email } });
};

const findById = async (id) => {
  return await Register.findByPk(id, {
    include: [{ model: Role, as: "role" }],
  });
};

const update = async (id, data) => {
  return await Register.update(data, { where: { id } });
};

module.exports = {
  createUser,
  findByEmail,
  updatePasswordByEmail,
  findById,
  update,
};
