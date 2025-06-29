const { hashPassword, comparePassword } = require('../../utils/hashPassword');
const generateToken = require('../../utils/generateToken');
const { PrismaClient } = require('@prisma/client');
const CustomError = require('../../utils/customError');
const prisma = new PrismaClient();


const registerUser = async ({ name, email, password, role }) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new CustomError('Email already registered.',404);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user' // default role if not provided
      }
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    
    throw new CustomError('Something went wrong during registration',500);
  }
};


const loginUser = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new CustomError('Invalid email or password',401);
    }

    const validPassword = await comparePassword(password, user.password); // Use comparePassword from utils
    if (!validPassword) {
      throw new CustomError('Invalid email or password',401);
    }

    // Generate JWT token with an expiration time of 1 hour (optional)
    const token = generateToken(user.id,user.role);

    return { message: 'Login successful', token, user: { id: user.id, email: user.email } };
  } catch (error) {
    // Log error and throw custom error message
   
    throw new CustomError('Something went wrong during login',500);
  }
};



const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new CustomError('User not found',404);
  }

  return user;
};





module.exports = {
  getUserProfile,
  loginUser,
  registerUser
};