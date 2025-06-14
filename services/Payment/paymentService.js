const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE Razorpay order
exports.createRazorpayOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };
    console.log("i am here in create order")
  const order = await razorpay.orders.create(options);
  console.log(order)
  return order;
};

// VERIFY Razorpay payment signature
exports.verifyRazorpaySignature = (order_id, payment_id, signature) => {
  const body = `${order_id}|${payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
      console.log(expectedSignature === signature)
  return expectedSignature === signature;
};
