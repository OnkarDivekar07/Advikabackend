const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController
} = require('../../controllers/Cart/cartController');

router.use(authenticate); // Protect all cart routes

router.get('/', getCartController);
router.post('/', addToCartController);
router.put('/', updateCartItemController);
router.delete('/', removeFromCartController);

module.exports = router;
