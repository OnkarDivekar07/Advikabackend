const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const orderController = require('../../controllers/Order/orderController');
const authorizeAdmin = require('../../middlewares/Admin/admin');
const  ordervalidation= require("../../validators/orderValidator")
const  validateRequest=require("../../middlewares/validateRequest/validateRequest")


router.post('/', authenticate,ordervalidation.validateDraftOrder,validateRequest, orderController.createDraftOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/all',authenticate,authorizeAdmin, orderController.getOrders);
router.get("/:id", authenticate,authorizeAdmin, orderController.getOrderById);


module.exports = router;
