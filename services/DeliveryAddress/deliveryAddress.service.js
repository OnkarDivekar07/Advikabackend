
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createAddress = async (data) => {
  return await prisma.address.create({ data });
};

exports.getAddressesByUserId = async (userId) => {
  return await prisma.address.findMany({
    where: { userId },
  });
};

exports.updateAddressById = async (id, data) => {
  return await prisma.address.update({
    where: { id },
    data,
  });
};

exports.deleteAddressById = async (id) => {
  return await prisma.address.delete({
    where: { id },
  });
};
