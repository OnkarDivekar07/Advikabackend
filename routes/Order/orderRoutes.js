const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const orderController = require('../../controllers/Order/orderController');
const authorizeAdmin = require('../../middlewares/Admin/admin');

router.post('/', authenticate, orderController.createDraftOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/all',authenticate,authorizeAdmin, orderController.getOrders);
router.get("/:id", authenticate,authorizeAdmin, orderController.getOrderById);


module.exports = router;
