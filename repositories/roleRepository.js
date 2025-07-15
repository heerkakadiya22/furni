const { Role } = require("../models");

const roleRepository = {
  // Create a new role
  async create(data) {
    return await Role.create(data);
  },

  // Find all roles
  async findAll() {
    return await Role.findAll();
  },

  // Find one role by ID
  async findById(id) {
    return await Role.findByPk(id);
  },

  // Find one role by name
  async findByName(rolename) {
    return await Role.findOne({ where: { rolename } });
  },

  // Update a role by ID
  async update(id, data) {
    const role = await Role.findByPk(id);
    if (!role) return null;
    return await role.update(data);
  },

  // Delete a role by ID
  async delete(id) {
    return await Role.destroy({ where: { id } });
  },
};

module.exports = roleRepository;
