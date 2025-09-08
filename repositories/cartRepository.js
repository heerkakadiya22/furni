const { Cart } = require("../models");

class CartRepository {
  async findCartItem(userId, productId) {
    return await Cart.findOne({ where: { userId, productId } });
  }

  async createCartItem(userId, productId, quantity) {
    return await Cart.create({ userId, productId, quantity });
  }

  async updateCartItem(cartItem, quantity) {
    cartItem.quantity = quantity;
    return await cartItem.save();
  }

  async getUserCart(userId) {
    return await Cart.findAll({
      where: { userId },
      include: ["product"],
    });
  }

  async removeCartItem(userId, productId) {
    return await Cart.destroy({ where: { userId, productId } });
  }
}

module.exports = new CartRepository();
