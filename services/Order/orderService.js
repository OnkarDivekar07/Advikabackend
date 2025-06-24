const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createOrUpdateDraftOrderService = async ({ userId }) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch cart items with product info
    const cartItems = await tx.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems || cartItems.length === 0) {
      throw new Error('No items found in cart');
    }

    // 2. Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 3. Check for existing draft order
    let draftOrder = await tx.order.findFirst({
      where: {
        userId,
        status: 'draft',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (draftOrder) {
      // 4. Delete previous order items to avoid duplication
      await tx.orderItem.deleteMany({
        where: {
          orderId: draftOrder.id,
        },
      });

      // 5. Re-create order items with latest cart
      await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              orderId: draftOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            },
          })
        )
      );

      // 6. Update order total
      draftOrder = await tx.order.update({
        where: { id: draftOrder.id },
        data: {
          total,
        },
      });
    } else {
      // 7. Create a new draft order
      draftOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'draft',
          payment: {}, // Placeholder
        },
      });

      await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              orderId: draftOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            },
          })
        )
      );
    }

    // 8. Clear the cart
    await tx.cart.deleteMany({
      where: { userId },
    });

    // 9. Fetch full order to return
    const fullOrder = await tx.order.findUnique({
      where: { id: draftOrder.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return fullOrder;
  });
};

exports.getUserDraftOrder = async (userId) => {
  const draftOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: 'draft'
    },
    select: {
      id: true,               // order ID
      userId: true,
      total: true,
      status: true,
      createdAt: true,
      payment: true,          // includes payment object
      orderItems: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true
            }
          }
        }
      }
    }
  });

  return draftOrder;
};
