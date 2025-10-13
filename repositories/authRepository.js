const { User, Role } = require("../models");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updatePasswordByEmail = async(email, newPassword) => {
  return await User.update({ password: newPassword }, { where: { email } });
};

const findById = async (id) => {
  return await User.findByPk(id, {
    include: [{ model: Role, as: "role" }],
  });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

const update = async (id, data) => {
  return await User.update(data, { where: { id } });
};

const findAll = async () => {
  return await User.findAll({
    include: [{ model: Role, as: "role" }],
  });
};

module.exports = {
  createUser,
  findByEmail,
  updatePasswordByEmail,
  findById,
  update,
  findAll,
  deleteUser,
};
