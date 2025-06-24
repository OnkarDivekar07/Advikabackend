const Razorpay = require("razorpay");
const crypto = require("crypto");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async ({ amount, currency, receipt }) => {
  const options = {
    amount,       // amount in paise
    currency,
    receipt,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

exports.verifyRazorpaySignature = (order_id, payment_id, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  return generatedSignature === signature;
};
