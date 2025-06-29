const orderService = require('../../services/Order/orderService');
const CustomError=require('../../utils/customError')

exports.createDraftOrder = async (req, res,next) => {
  try {
    const userId = req.user.userId;
    const { selectedAddressId } = req.body;
    
    const order = await orderService.createOrUpdateDraftOrderService({ userId,selectedAddressId });

    res.status(201).json({ message: 'Draft order created/updated', order,success: true });
  } catch (error) {
    next(error)
  }
};

exports.getUserOrders = async (req, res,next) => {
  try {
    const userId = req.user.userId;
    
    const orders = await orderService.getUserDraftOrder(userId);

    if (orders) {
      res.status(200).json({
        success: true,
        order: orders,
      });
    } else {
      throw new CustomError('No draft order found.',404);
    }
  } catch (err) {
   next(err)
  }
};

exports.getOrders = async (req, res,next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
     next(error)
  }
};


exports.getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await orderService.fetchOrderById(id);

    if (!order) {
       throw new CustomError('No draft order found.',404);
    }

    res.status(200).json(order);
  } catch (error) {
    next(error)
  }
};