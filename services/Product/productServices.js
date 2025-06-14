const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Product not found');
  return product;
};

const createProduct = async (data) => {
  return await prisma.product.create({ data });
};

const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id } });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
