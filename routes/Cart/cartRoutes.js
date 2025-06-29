const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const controller = require('../../controllers/Cart/cartController');
const cartValidator=require('../../validators/cartValidator')
const  validateRequest=require("../../middlewares/validateRequest/validateRequest")
router.use(authenticate); // Protect all cart routes


router.post("/",authenticate,cartValidator.validateSaveCart,validateRequest,controller.saveCart);
router.get("/",authenticate,controller.getCartController)

module.exports = router;
