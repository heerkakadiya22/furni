const cartRepo = require("../repositories/cartRepository");
const productRepo = require("../repositories/productRepository");
const cartHelper = require("../helper/cartHelper");

exports.renderCart = async (req, res) => {
  try {
    let cartItems = [];

    if (req.session.user) {
      cartItems = await cartRepo.getUserCart(req.session.user.id);
    } else {
      const sessionCart = req.session.cart || [];
      const productIds = sessionCart.map((i) => i.productId);
      const products = await productRepo.findBySkus(productIds);

      cartItems = sessionCart.map((item) => {
        const product = products.find((p) => p.sku == item.productId);
        return { product, quantity: item.quantity };
      });
    }

    const totals = cartHelper.calculateCartTotals(cartItems);

    res.render("cart", {
      title: "Cart",
      cart: cartItems,
      subtotal: totals.subtotal.toFixed(2),
      total: totals.total.toFixed(2),
      csrfToken: req.csrfToken(),
      currentPage: "Cart",
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

exports.addOrUpdateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID missing" });
    }

    if (req.session.user) {
      const userId = req.session.user.id;
      let cartItem = await cartRepo.findCartItem(userId, productId);

      if (cartItem) {
        await cartRepo.updateCartItem(cartItem, qty);
      } else {
        await cartRepo.createCartItem(userId, productId, qty);
      }
    } else {
      if (!req.session.cart) req.session.cart = [];
      const index = req.session.cart.findIndex(
        (item) => item.productId == productId
      );

      if (index !== -1) {
        req.session.cart[index].quantity = qty;
      } else {
        req.session.cart.push({ productId, quantity: qty });
      }
    }

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Cart add/update ERROR:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.session.user) {
      await cartRepo.removeCartItem(req.session.user.id, id);
    } else {
      req.session.cart = req.session.cart.filter((i) => i.productId != id);
    }

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
