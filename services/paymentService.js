const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const cartRepo = require("../repositories/cartRepository");
const invoiceRepo = require("../repositories/invoiceRepository");

module.exports = {
  async createOrder(userId) {
    const cart = await cartRepo.getUserCart(userId);

    if (!cart.length) throw new Error("Cart is empty");

    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.quantity * item.product.newPrice;
    });

    const deliveryFee = cart.length > 0 ? 50 : 0;
    const discount = 0;

    const total = subtotal + deliveryFee - discount;

    const order = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: "rec_" + Date.now(),
    });

    return { order, total };
  },

  async verifyPayment(
    { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    sessionOrder,
    userId,
    addressId
  ) {
    if (razorpay_order_id !== sessionOrder.id) {
      throw new Error("Order ID mismatch");
    }

    const body = sessionOrder.id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const invoice = await invoiceRepo.create({
      user_id: userId,
      transaction_id: razorpay_payment_id,
      order_date: new Date(),
      total_amount: sessionOrder.total,
      received_amount: sessionOrder.total,
      status: 1,
      address: addressId || null,
    });

    await cartRepo.clearCart(userId);

    return invoice;
  },
};
