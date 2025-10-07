module.exports = {
  calculateCartTotals(cartItems) {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.product.newPrice * item.quantity;
    });
    const discount = 0;
    const deliveryFee = 50;
    const total = subtotal - discount + deliveryFee;

    return { subtotal, total, discount, deliveryFee };
  },

  findCartItem(cartItems, productId) {
    return cartItems.find((item) => item.productId == productId);
  },
};
