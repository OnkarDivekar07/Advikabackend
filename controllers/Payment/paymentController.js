const paymentService = require("../../services/Payment/paymentService");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Assuming you're using Prisma

exports.createOrderid = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🟡 Step 1: Find the latest draft order of the user
    const draftOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: "draft",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!draftOrder || draftOrder.total <= 0) {
      return res.status(400).json({ success: false, message: "No valid draft order" });
    }
   
    // 🟡 Step 2: Create Razorpay Order ID with amount
    const razorpayOrder = await paymentService.createRazorpayOrder({
      amount: draftOrder.total * 100, // Convert to paise
      currency: "INR",
      receipt: "order_" + draftOrder.id,
      order_id:draftOrder.id
    });

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const isValid = paymentService.verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      // Optionally, update order status in DB
     await paymentService.updateOrderAfterPayment(razorpay_order_id, razorpay_payment_id);
    return res.status(200).json({ success: true, message: "Payment verified" });
    }

    res.status(400).json({ success: false, message: "Invalid signature" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.placeCODOrder = async (req, res) => {
  
  const userId = req.user.userId;

  const { orderId, method } = req.body;
  
  



  if (method !== "cod") {
    return res.status(400).json({ success: false, message: "Invalid method" });
  }

  try {
    const result = await paymentService.handleCODOrder(orderId,userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
