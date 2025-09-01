const { Product, Category } = require("../models");

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findAll() {
    return await Product.findAll({
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
}

module.exports = new ProductRepository();
