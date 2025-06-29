const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../../controllers/auth/authController');
//const { validateSendOtp, validateVerifyOtp } = require('../../middlewares/validateOtpRequest');
const {validateSendOtp,validateVerifyOtp}=require('../../validators/validateOtpRequest')
const validateRequest = require('../../middlewares/validateRequest/validateRequest');
router.post('/send-otp', validateSendOtp,validateRequest, sendOtp);
router.post('/verify-otp', validateVerifyOtp,validateRequest,verifyOtp);

module.exports = router;
