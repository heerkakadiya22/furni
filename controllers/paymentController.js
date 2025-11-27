const paymentService = require("../helper/paymentHelper");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    const { order, total } = await paymentService.createOrder(userId);

    req.session.order = {
      id: order.id,
      total: total,
    };
    res.json({ id: order.id, amount: order.amount });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    const sessionOrder = req.session.order;

    if (!sessionOrder)
      return res.status(400).json({ error: "No order session" });

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address_id,
      statusType,
    } = req.body;

    const invoice = await paymentService.verifyPayment(
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        statusType,
      },
      sessionOrder,
      userId,
      address_id
    );

    delete req.session.order;

    if (statusType === "failed") {
      return res.json({
        success: false,
        invoice_id: invoice.id,
        message: "Payment failed or cancelled",
      });
    }

    res.json({ success: true, invoice_id: invoice.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
