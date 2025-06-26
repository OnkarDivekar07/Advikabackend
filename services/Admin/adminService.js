const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAdminStats = async () => {
  const totalUsers = await prisma.user.count({
    where: { role: 'customer' }
  });

  const totalOrders = await prisma.order.count({
    where: { status: 'confirmed' }
  });

  const totalProducts = await prisma.product.count({
    where: { isDeleted: false }
  });

  const deliveredOrders = await prisma.order.count({
    where: { status: 'delivered' }
  });

  const pendingOrders = await prisma.order.count({
    where: { status: 'pending' }
  });

  const totalRevenueResult = await prisma.order.aggregate({
    where: { paymentStatus: 'paid' },
    _sum: { total: true }
  });

  const totalRevenue = totalRevenueResult._sum.total || 0;

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    deliveredOrders,
    pendingOrders,
    totalRevenue
  };
};
