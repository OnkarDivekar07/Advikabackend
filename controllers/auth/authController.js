const { sendOtpService, verifyOtpService } = require('../../services/auth/authService');

exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    await sendOtpService(phone);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
     next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;
  try {
    const { token, user,success  } = await verifyOtpService(phone, otp);
    res.json({ message: 'OTP verified', token, user: { id: user.id, phone: user.phone },success });
  } catch (err) {
        next(err);
  }
};
