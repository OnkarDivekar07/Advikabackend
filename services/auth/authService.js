const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const twilio = require('twilio');
const otpStore = require('../../utils/otpStore');
const generateToken  = require('../../utils/generateToken');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtpService = async (phone) => {
  console.log("Sending OTP to phone:", phone); // or mobile if that's the var
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};

exports.verifyOtpService = async (phone, otp) => {
  const record = otpStore[phone];
  if (!record) throw new Error('OTP not found');
  if (Date.now() > record.expiresAt) throw new Error('OTP expired');
  if (record.otp !== otp) throw new Error('Invalid OTP');

  delete otpStore[phone];

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name: 'New User',
        email: `${phone}@advika.fake`,
        password: '',
        role: 'customer',
      },
    });
  }

  const token = generateToken(user.id, user.role);
  return { token, user,success: true };
};
