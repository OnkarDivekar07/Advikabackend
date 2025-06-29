const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const twilio = require('twilio');
const otpStore = require('../../utils/otpStore');
const generateToken  = require('../../utils/generateToken');
const CustomError=require('../../utils/customError')

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtpService = async (phone) => {
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  await client.messages.create({
    body: `Your Advika OTP is ${otp}. Do not share it with anyone.`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};

exports.verifyOtpService = async (phone, otp) => {
  const record = otpStore[phone];
  if (!record) {
  throw new CustomError('OTP not found', 404);
}

if (Date.now() > record.expiresAt) {
  throw new CustomError('OTP has expired', 410); // 410 Gone is semantically correct for expired resources
}

if (record.otp !== otp) {
  throw new CustomError('Invalid OTP', 400);
}

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
