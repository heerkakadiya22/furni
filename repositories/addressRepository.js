const { Address } = require("../models");

class AddressRepository {
  async create(data) {
    return await Address.create(data);
  }

  async findAllByUser(userId) {
    return await Address.findAll({
      where: { user_id: userId },
      order: [["id", "ASC"]],
    });
  }

  async findById(id) {
    return await Address.findByPk(id);
  }

  async update(id, data) {
    const address = await Address.findByPk(id);
    if (!address) throw new Error("Address not found");
    return await address.update(data);
  }

  async delete(id) {
    const address = await Address.findByPk(id);
    if (!address) throw new Error("Address not found");
    return await address.destroy();
  }
  async findDefaultByUser(userId) {
    return await Address.findOne({
      where: { user_id: userId, isDefault: true },
    });
  }
}

module.exports = new AddressRepository();
