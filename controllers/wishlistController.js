const { Product, Wishlist } = require("../models");

exports.renderWishlist = async (req, res) => {
  try {
    if (!req.session?.user) return res.redirect("/auth");

    const userId = req.session.user.id;

    const wishlists = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "newPrice", "oldPrice", "main_img", "sku"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("Wishlist", {
      title: "Wishlist",
      csrfToken: req.csrfToken(),
      currentPage: "Wishlist",
      session: req.session,
      products: wishlists,
    });
  } catch (error) {
    console.error("Error rendering Wishlist page:", error);
    res.status(500).send("Something went wrong.");
  }
};

// Toggle wishlist: add or remove
exports.toggleWishlist = async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const { sku } = req.body;
  const userId = req.session.user.id;

  if (!sku) return res.status(400).json({ message: "SKU required" });

  try {
    const existing = await Wishlist.findOne({ where: { userId, sku } });

    let action;
    if (existing) {
      await existing.destroy();
      action = "removed";
    } else {
      await Wishlist.create({ userId, sku });
      action = "added";
    }

    res.status(200).json({ action, message: `Product ${action} to wishlist` });
  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const { sku } = req.params;
  const userId = req.session.user.id;

  if (!sku) return res.status(400).json({ message: "SKU required" });

  try {
    const existing = await Wishlist.findOne({ where: { userId, sku } });

    if (!existing) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    await existing.destroy();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
