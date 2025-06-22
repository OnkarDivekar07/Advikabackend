const { sendOtpService, verifyOtpService } = require('../../services/auth/authService');

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    await sendOtpService(phone);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const { token, user,success  } = await verifyOtpService(phone, otp);
    res.json({ message: 'OTP verified', token, user: { id: user.id, phone: user.phone },success });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
