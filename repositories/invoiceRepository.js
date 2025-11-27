const { Invoice } = require("../models");

module.exports = {
  create(invoiceData) {
    return Invoice.create(invoiceData);
  },

  findByUser(userId) {
    return Invoice.findAll({ where: { user_id: userId } });
  },

  findById(id) {
    return Invoice.findByPk(id);
  }
};
