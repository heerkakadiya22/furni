module.exports = {
  calculateCartTotals(cartItems) {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.product.newPrice * item.quantity;
    });
    const total = subtotal;
    return { subtotal, total };
  },

  findCartItem(cartItems, productId) {
    return cartItems.find((item) => item.productId == productId);
  },
};
