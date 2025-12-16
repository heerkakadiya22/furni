const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const cartRepo = require("../repositories/cartRepository");
const invoiceRepo = require("../repositories/invoiceRepository");
const addressRepo = require("../repositories/addressRepository");

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
    { razorpay_order_id, razorpay_payment_id, razorpay_signature, statusType },
    sessionOrder,
    userId,
    addressId
  ) {
    if (addressId === "null" || addressId === "undefined" || addressId === "") {
      addressId = null;
    }
    let finalAddressId = addressId;

    if (!finalAddressId) {
      const defaultAddress = await addressRepo.findDefaultByUser(userId);

      if (!defaultAddress) {
        throw new Error("No address selected and no default address found");
      }

      finalAddressId = defaultAddress.id;
    }

    if (statusType === "failed") {
      const invoice = await invoiceRepo.create({
        user_id: userId,
        transaction_id: null,
        order_date: new Date(),
        total_amount: sessionOrder.total,
        received_amount: 0,
        status: 0,
        address: finalAddressId || null,
      });

      await cartRepo.clearCart(userId);
      return invoice;
    }

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

    const cartItems = await cartRepo.getUserCart(userId);

    const orderedItems = cartItems.map((item) => ({
      product_name: item.product.name,
      price: item.product.newPrice,
      quantity: item.quantity,
      image: item.product.main_img,
    }));

    const invoice = await invoiceRepo.create({
      user_id: userId,
      transaction_id: razorpay_payment_id,
      order_date: new Date(),
      total_amount: sessionOrder.total,
      received_amount: sessionOrder.total,
      status: 1,
      address: finalAddressId || null,
      extra: JSON.stringify(orderedItems),
    });

    await cartRepo.clearCart(userId);

    return invoice;
  },
};
