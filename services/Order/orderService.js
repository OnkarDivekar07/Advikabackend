const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createOrUpdateDraftOrderService = async ({ userId, selectedAddressId }) => {
    
  if (!userId) {
    throw new Error('User ID is required');
  }
 
  if (selectedAddressId) {
  const address = await prisma.address.findUnique({
    where: { id: selectedAddressId },
  });

  if (!address || address.userId !== userId) {
    throw new Error("Invalid or unauthorized address.");
  }
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
          addressId: selectedAddressId
        },
      });
    } else {
      // 7. Create a new draft order
      draftOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'draft',
          addressId: selectedAddressId
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


exports.getAllOrders = async () => {
  const ordersRaw = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Format the data to match frontend expectations
  const orders = ordersRaw.map((order) => ({
  id: order.id,
  user: {
    id: order.userId,
    name: order.user?.name || "N/A",
  },
  createdAt: order.createdAt, // needed as-is
  total: order.total,
  status: order.status,
  paymentStatus: order.paymentStatus,
}));

  return orders;
};


exports.fetchOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      address: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return order;
};