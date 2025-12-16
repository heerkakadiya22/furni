const { Invoice, User, Address } = require("../models");

exports.renderInvoice = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const invoiceId = Number(req.params.id);
    const userId = req.session.user.id;

    const invoice = await Invoice.findOne({
      where: {
        id: invoiceId,
        user_id: userId,
        status: 1,
      },
    });

    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    const user = await User.findOne({
      where: { id: invoice.user_id },
      attributes: ["name", "email"],
    });

    const address = await Address.findOne({
      where: { id: invoice.address },
    });

    let items = [];
    try {
      items = invoice.extra ? JSON.parse(invoice.extra) : [];
    } catch (error) {
      console.error("Error parsing invoice items:", error);
    }

    res.render("invoice", {
      title: "Invoice",
      invoice,
      user,
      address,
      items,
      session: req.session,
      currentPage: "invoice",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.error("INVOICE PAGE ERROR:", err);
    res.status(500).send("Something went wrong");
  }
};
