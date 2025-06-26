const orderService = require('../../services/Order/orderService');

exports.createDraftOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { selectedAddressId } = req.body;
         console.log("adressid",selectedAddressId)
    const order = await orderService.createOrUpdateDraftOrderService({ userId,selectedAddressId });

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

exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orderService.fetchOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};