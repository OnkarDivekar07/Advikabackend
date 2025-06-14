const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCart = async (userId) => {
  return await prisma.cart.findMany({
    where: { userId },
    include: { product: true }
  });
};

const addToCart = async (userId, productId, quantity) => {
  const existing = await prisma.cart.findFirst({ where: { userId, productId } });

  if (existing) {
    return await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
  }

  return await prisma.cart.create({
    data: { userId, productId, quantity }
  });
};

const updateCartItem = async (userId, productId, quantity) => {
  return await prisma.cart.updateMany({
    where: { userId, productId },
    data: { quantity }
  });
};

const removeFromCart = async (userId, productId) => {
  await prisma.cart.deleteMany({
    where: { userId, productId }
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
