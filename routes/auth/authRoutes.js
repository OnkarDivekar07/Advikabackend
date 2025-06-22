const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../../controllers/auth/authController');
const { validateSendOtp, validateVerifyOtp } = require('../../middlewares/validateOtpRequest');

router.post('/send-otp', validateSendOtp, sendOtp);
router.post('/verify-otp', validateVerifyOtp, verifyOtp);

module.exports = router;
