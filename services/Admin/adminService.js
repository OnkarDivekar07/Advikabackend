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


exports.getAllUsersWithStats = async () => {
  const users = await prisma.user.findMany({
    where:{
      role:'customer'
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      addresses: {
        select: {
          houseArea: true,
          city: true,
          state: true,
          pincode: true,
        }
      },
      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true
        }
      }
    }
  });

  return users.map((user) => {
    const totalOrders = user.orders.length;
    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
    const lastOrderDate = user.orders.reduce((latest, order) =>
      new Date(order.createdAt) > new Date(latest) ? order.createdAt : latest,
      null
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      joinedOn: user.createdAt,
      addresses: user.addresses,
      totalOrders,
      totalSpent,
      lastOrderDate
    };
  });
};
