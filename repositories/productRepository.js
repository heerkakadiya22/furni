const { Product, Category } = require("../models");
const { Op } = require("sequelize");

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findAll(filters = {}) {
    return await Product.findAll({
      where: filters,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "DESC"]],
    });
  }

  async findById(id) {
    return await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findByIds(ids) {
    return await Product.findAll({
      where: { id: { [Op.in]: ids } },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findByName(name) {
    return await Product.findOne({
      where: { name },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async update(id, productData) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(productData);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return true;
  }

  async findBySku(sku) {
    return await Product.findOne({ where: { sku } });
  }

  async findBySkus(skus) {
    return await Product.findAll({
      where: { sku: { [Op.in]: skus } },
    });
  }
}

module.exports = new ProductRepository();
