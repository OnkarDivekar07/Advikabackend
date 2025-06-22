exports.validateSendOtp = (req, res, next) => {
  if (!req.body.phone) return res.status(400).json({ error: 'Phone number is required' });
  next();
};

exports.validateVerifyOtp = (req, res, next) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });
  next();
};
