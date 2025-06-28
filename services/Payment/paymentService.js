const Razorpay = require("razorpay");
const crypto = require("crypto");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async ({ amount, currency = "INR", receipt, order_id }) => {
  try {
    // 1. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,       // in paise
      currency,
      receipt,
    });

    // 2. Update your DB with the Razorpay order ID
    const updateOrderPromise = prisma.order.update({
      where: { id: order_id },
      data: {
        payment_order_id: razorpayOrder.id,
      },
    });

    // 3. Wait for update (useful if you plan to expand with more parallel promises later)
    await Promise.all([updateOrderPromise]);

    return razorpayOrder;
  } catch (err) {
    console.error("Failed to create and attach Razorpay order:", err);
    throw new Error("Unable to create payment order.");
  }
};



exports.verifyRazorpaySignature = (order_id, payment_id, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  return generatedSignature === signature;
};


exports.updateOrderAfterPayment = async (order_id, payment_id) => {
  return prisma.order.update({
    where: { payment_order_id: order_id },
    data: {
      paymentStatus: "paid",
      status: "confirmed"
    },
  });
};



exports.handleCODOrder = async (orderId, userId) => {
  try {
    // 1. Fetch the order to verify ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
 
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized: Order does not belong to this user");
    }

    // 2. Update the order with COD details
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "cod_pending",
        status: "confirmed",
        payment_order_id:`cod-${orderId}`
      },
    });

    return { success: true, order: updatedOrder };
  } catch (err) {
    console.error("COD Order Error:", err);
    throw new Error(err.message || "Failed to place COD order");
  }
};
