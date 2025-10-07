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
      if (sessionCart.length > 0) {
        const productIds = sessionCart.map((i) => i.productId);

        const products = await productRepo.findByIds(productIds);

        cartItems = sessionCart
          .map((item) => {
            const product = products.find((p) => p.id == item.productId);
            if (!product) {
              return null;
            }
            return { product, quantity: item.quantity };
          })
          .filter(Boolean);
      }
    }

    const hasItems = cartItems.length > 0;
    const deliveryFee = hasItems ? 50 : 0;
    const discount = hasItems ? 0 : 0;

    const totals = cartItems.length
      ? cartHelper.calculateCartTotals(cartItems)
      : { subtotal: 0, total: 0 };

    res.render("cart", {
      title: "Cart",
      cart: cartItems,
      subtotal: totals.subtotal.toFixed(2),
      total: totals.total.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      discount: discount.toFixed(2),
      csrfToken: req.csrfToken(),
      currentPage: "Cart",
      session: req.session,
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
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
        await cartRepo.updateCartItem(cartItem, cartItem.quantity + qty);
      } else {
        await cartRepo.createCartItem(userId, productId, qty);
      }
    } else {
      if (!req.session.cart) req.session.cart = [];
      const index = req.session.cart.findIndex(
        (item) => item.productId == productId
      );

      if (index !== -1) {
        req.session.cart[index].quantity += qty;
      } else {
        req.session.cart.push({ productId, quantity: qty });
      }
    }

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Cart add ERROR:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!productId || isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    if (req.session.user) {
      const userId = req.session.user.id;
      let cartItem = await cartRepo.findCartItem(userId, productId);

      if (cartItem) {
        await cartRepo.updateCartItem(cartItem, qty);
      }
    } else {
      if (!req.session.cart) req.session.cart = [];
      const index = req.session.cart.findIndex(
        (item) => item.productId == productId
      );

      if (index !== -1) {
        req.session.cart[index].quantity = qty;
      }
    }

    res.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("Cart update ERROR:", error);
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

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Cart remove ERROR:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
