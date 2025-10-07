const cartRepo = require("../repositories/cartRepository");
const productRepo = require("../repositories/productRepository");

async function cartCount(req, res, next) {
  let cartItems = [];

  if (req.session.user) {
    cartItems = await cartRepo.getUserCart(req.session.user.id);
  } else {
    const sessionCart = req.session.cart || [];
    if (sessionCart.length > 0) {
      const productIds = sessionCart.map((i) => i.productId);
      const products = await productRepo.findByIds(productIds);

      cartItems = sessionCart
        .map((item) => {
          const product = products.find((p) => p.id == item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter(Boolean);
    }
  }

  res.locals.cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  next();
}

module.exports = { cartCount };
