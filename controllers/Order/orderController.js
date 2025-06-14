const orderService = require('../../services/Order/orderService');

exports.createOrder = async (req, res) => {
  try {
    console.log(req.user.userId)
    const order = await orderService.createOrder(req.user.userId, req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
