const orderService = require('../../services/Order/orderService');

exports.createDraftOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const order = await orderService.createOrUpdateDraftOrderService({ userId });

    res.status(201).json({ message: 'Draft order created/updated', order,success: true });
  } catch (error) {
    console.error('Draft Order Error:', error);
    res.status(400).json({ message: error.message || 'Something went wrong' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getUserDraftOrder(userId);

    if (orders) {
      res.status(200).json({
        success: true,
        order: orders,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No draft order found.",
      });
    }
  } catch (err) {
    console.log("Draft Order Error:", err.message);
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

