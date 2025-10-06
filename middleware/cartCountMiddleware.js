const cartRepository = require("../repositories/cartRepository");

async function cartCount(req, res, next) {
  let count = 0;
  if (req.session.user) {
    const cartItems = await cartRepository.getUserCart(req.session.user.id);
    count = cartItems.length;
  }
  res.locals.cartCount = count;
  next();
}

module.exports = {
  cartCount,
};
