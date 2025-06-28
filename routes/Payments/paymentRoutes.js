const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/Payment/paymentController");
const auth = require("../../middlewares/Authentication/auth");

router.post("/create-orderid",auth, paymentController.createOrderid);
router.post("/verify",auth, paymentController.verifyPayment);
router.post("/cod",auth,paymentController.placeCODOrder)

module.exports = router;
