const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/Payment/paymentController");
const auth = require("../../middlewares/Authentication/auth");
const  paymentvalidation= require("../../validators/paymentValidation")
const  validateRequest=require("../../middlewares/validateRequest/validateRequest")



router.post("/create-orderid",auth, paymentController.createOrderid);
router.post("/verify",auth,paymentvalidation.validateVerifyPayment,validateRequest, paymentController.verifyPayment);
router.post("/cod",auth,paymentvalidation.validateCODOrder,validateRequest,paymentController.placeCODOrder)

module.exports = router;
