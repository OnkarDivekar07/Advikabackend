const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const orderController = require('../../controllers/Order/orderController');

router.post('/', authenticate, orderController.createDraftOrder);
router.get('/', authenticate, orderController.getUserOrders);

module.exports = router;
