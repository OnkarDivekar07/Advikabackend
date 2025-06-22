const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/Authentication/auth');
const controller = require('../../controllers/Cart/cartController');

router.use(authenticate); // Protect all cart routes


router.post("/",authenticate,controller.saveCart);

module.exports = router;
