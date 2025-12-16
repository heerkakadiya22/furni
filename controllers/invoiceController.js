const { Invoice, User, Address } = require("../models");

exports.renderInvoice = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");

    const invoiceId = Number(req.params.id);
    if (Number.isNaN(invoiceId)) {
      return res.status(400).send("Invalid invoice id");
    }

    const invoice = await Invoice.findOne({
      where: {
        id: invoiceId,
        user_id: req.session.user.id,
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
      const parsed = invoice.extra ? JSON.parse(invoice.extra) : [];
      items = Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      console.error("BROKEN INVOICE JSON:", invoice.extra);
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

