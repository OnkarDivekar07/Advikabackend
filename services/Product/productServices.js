const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { isDeleted: false },
  });
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
  console.log('UPDATE DATA RECEIVED:', data); // debug here
  return await prisma.product.update({
    where: { id },
    data, // <== must not be undefined
  });
};


const deleteProduct = async (id) => {
  return await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const getRelatedProducts = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: {
        has: product.category[0], // Or use hasSome: product.category
      },
      id: {
        not: productId,
      },
    },
    take: 4,
  });

  return relatedProducts;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
};
