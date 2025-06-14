const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (userId, { items, total, paymentInfo }) => {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'pending',
          payment: paymentInfo, // 🔥 Correct usage
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          orderItems: true
        }
      });
      return order;
    });
  };
  
  exports.getUserOrders = async (userId) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    return orders;
  };
  